import {
  AutoModChecker,
  AutoModCheckerType,
  AutoModCheckerPriority,
  ModlogReason,
  consts
} from "#lib";

import { AutomodModule } from "@prisma/client";
import { Collection, GuildMember, User } from "discord.js";

export class AntiMassJoin extends AutoModChecker {
  /**
   * The name of the module
   */
  public name = AutomodModule.MASS_JOIN;

  /**
   * The type of this checker
   */
  public type = AutoModCheckerType.GuildMemberAdd;

  /**
   * The priority of this checker
   */
  public priority = AutoModCheckerPriority.High;

  /**
   * Guild member join buckets - a store for recent joins
   */
  public joinBuckets = new Collection<string, JoinBucket>();

  /**
   * The timer for resetting members
   */
  public resetMemberTimer?: NodeJS.Timer;

  /**
   * Checks the member for mass join
   */
  public async run(member: GuildMember): Promise<boolean> {
    this._resetMembers();

    // const isYoungAccount =
    //   Date.now() - member.user.createdTimestamp < consts.minimumAccountAge;

    // if (!isYoungAccount) return false;

    // get or create bucket
    const existingBucket = this.joinBuckets.get(member.guild.id) ?? {
      lockdown: false,
      members: []
    };

    const bucket = {
      ...existingBucket,
      members: [
        ...existingBucket.members,
        {
          user: member.user,
          createdAt: member.user.createdAt,
          joinedAt: member.joinedAt ?? new Date()
        }
      ]
    };

    this.joinBuckets.set(member.guild.id, bucket);

    // if the server is in lockdown, ban the joined account
    if (bucket.lockdown) {
      await this.client.mod.actions
        .ban(
          member.guild,
          member.user,
          this.client.user as User,
          ModlogReason.MASS_JOIN_RAID,
          1
        )
        .catch(() => null);

      // Reset the lockdown timer if someone joins
      bucket.lockdownTimeout?.refresh();

      return true;
    }

    // check user join thresold
    const joins = bucket.members.length;

    if (joins >= consts.memberMassJoinThreshold.limit) {
      bucket.lockdown = true;
      bucket.lockdownTimeout = setTimeout(
        () => this.joinBuckets.delete(member.guild.id),
        consts.memberMassJoinThreshold.time
      );

      while (bucket.members.length) {
        const banMember = bucket.members.shift();
        if (!banMember) break;

        await this.client.mod.actions
          .ban(
            member.guild,
            banMember.user,
            this.client.user as User,
            ModlogReason.MASS_JOIN_RAID,
            1
          )
          .catch(() => null);
      }

      this.joinBuckets.set(member.guild.id, { ...bucket, members: [] });
    }

    return false;
  }

  private _resetMembers() {
    if (this.resetMemberTimer) return;

    this.resetMemberTimer = setInterval(() => {
      for (const [guildId, bucket] of this.joinBuckets) {
        this.joinBuckets.set(guildId, {
          ...bucket,
          members: bucket.members.filter(
            (member) =>
              Date.now() - member.joinedAt.getTime() < consts.memberMassJoinThreshold.time
          )
        });
      }
    }, 5000);
  }
}

export interface JoinBucket {
  lockdown: boolean;
  lockdownTimeout?: NodeJS.Timeout;
  members: MemberJoin[];
}

export interface MemberJoin {
  user: User;
  createdAt: Date;
  joinedAt: Date;
}
