import { ModerationBase, ModerationManager, ModlogWithPendingAction } from "#lib";
import type { ModerationTask } from "@prisma/client";
import { ModlogReason } from "../ModerationShared";

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
  public async run(): Promise<ModlogWithPendingAction | null> {
    const result = await this.manager.actions
      .undo(this.modlogId, ModlogReason.EXPIRED)
      .catch(() => null);

    await this.cancel();

    return result;
  }

  /**
   * Cancels the pending moderation action
   */
  public cancel() {
    return this.manager.scheduler.delete(this.modlogId);
  }
}

export type ModerationPendingActionData = Pick<ModerationTask, "modlogId" | "expiresAt">;
