import { ModerationBase, ModerationManager, ModlogWithTask } from "#lib";
import type { ModerationTask } from "@prisma/client";

export class ModerationPendingAction extends ModerationBase {
  /**
   * The id of the modlog
   */
  public modlogId: string;

  /**
   * The timestamp this task expires
   */
  public expiresAt: number;

  /**
   * @param manager The manager instance
   * @param data The task data
   */
  public constructor(manager: ModerationManager, data: ModerationPendingActionData) {
    super(manager);

    this.modlogId = data.modlogId;
    this.expiresAt = data.expiresAt.getTime();
  }

  /**
   * Executes the pending moderation action
   */
  public run(): Promise<ModlogWithTask | null> {
    return this.manager.actions.reverse(this.modlogId).catch(() => null);
  }

  /**
   * Cancels the pending moderation action
   */
  public cancel() {
    return this.manager.scheduler.delete(this.modlogId);
  }
}

export type ModerationPendingActionData = Pick<ModerationTask, "modlogId" | "expiresAt">;
