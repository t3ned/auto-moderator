import { ModerationBase, ModlogWithTask, databaseProvider } from "#lib";

export class ModerationHistory extends ModerationBase {
  /**
   * Finds a modlog by id
   * @param modlogId The id of the modlog
   */
  public find(modlogId: string): Promise<ModlogWithTask | null> {
    return databaseProvider.client.modlog.findUnique({
      include: {
        task: true
      },
      where: {
        id: modlogId
      }
    });
  }
}
