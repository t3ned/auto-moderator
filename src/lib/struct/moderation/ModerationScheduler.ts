import {
  ModerationBase,
  ModerationPendingAction,
  databaseProvider,
  consts,
  logger
} from "#lib";

import type { ModerationTask } from "@prisma/client";

export class ModerationScheduler extends ModerationBase {
  /**
   * The pending tasks
   */
  public tasks: ModerationPendingAction[] = [];

  /**
   * The task checker interval
   */
  #interval: NodeJS.Timer | null = null;

  /**
   * Syncs the moderation tasks with the scheduler
   */
  public async init(): Promise<this> {
    const tasks = await databaseProvider.client.moderationTask.findMany();
    for (const task of tasks) this._add(task);
    await this._run();
    return this;
  }

  /**
   * Creates a pending moderation action
   * @param modlogId The id of the modlog
   * @param duration The duration of the task
   */
  public async create(
    modlogId: string,
    duration: number
  ): Promise<ModerationPendingAction> {
    const task = await databaseProvider.client.moderationTask.create({
      data: {
        duration,
        expiresAt: new Date(Date.now() + duration),
        modlog: {
          connect: {
            id: modlogId
          }
        }
      }
    });

    return this._add(task);
  }

  /**
   * Deletes a pending moderation action
   * @param modlogId The id of the modlog
   */
  public async delete(modlogId: string): Promise<ModerationPendingAction | null> {
    const modlog = await this.manager.history.find(modlogId);
    if (!modlog) throw new Error("Modlog not found.");

    await databaseProvider.client.moderationTask.delete({
      where: {
        modlogId
      }
    });

    return this._remove(modlog.id);
  }

  /**
   * Adds a pending moderation action to the cache
   * @param data The pending moderation task data
   */
  private _add(data: ModerationTask): ModerationPendingAction {
    const task = new ModerationPendingAction(this.manager, data);
    this._remove(task.modlogId);
    this.tasks.push(task);
    this._ensureInterval();
    return task;
  }

  /**
   * Removes a pending moderation action from the cache
   * @param modlogId The id of the modlog
   */
  private _remove(modlogId: string): ModerationPendingAction | null {
    const taskIndex = this.tasks.findIndex((task) => task.modlogId === modlogId);
    if (taskIndex === -1) return null;
    const [task] = this.tasks.splice(taskIndex, 1);
    this._ensureInterval();
    return task;
  }

  /**
   * Runs all the ready tasks
   */
  private async _run(): Promise<void> {
    const now = Date.now();
    const readyTasks = this.tasks.filter((task) => task.expiresAt < now);
    logger.info(`[Scheduler] Resolved ${readyTasks.length} tasks`);
    await Promise.all(readyTasks.map((task) => task.run()));
    return this._ensureInterval();
  }

  /**
   * Ensures the scheduler is running when there are tasks
   */
  private _ensureInterval(): void {
    if (this.#interval && !this.tasks.length) {
      logger.info("[Scheduler] Stopped interval");
      clearInterval(this.#interval);
      this.#interval = null;
    }

    if (!this.#interval && this.tasks.length) {
      logger.info("[Scheduler] Started interval");
      this.#interval = setInterval(
        this._run.bind(this),
        consts.moderationSchedulerPrecision
      );
    }
  }
}
