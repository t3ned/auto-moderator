import { MessageEmbed } from "discord.js";
import { consts } from "#lib";

export class Embed extends MessageEmbed {
  public setPrimaryColor(): this {
    return this.setColor(consts.Colors.Primary);
  }

  public setSuccessColor(): this {
    return this.setColor(consts.Colors.Success);
  }

  public setWarningColor(): this {
    return this.setColor(consts.Colors.Warning);
  }

  public setDangerColor(): this {
    return this.setColor(consts.Colors.Danger);
  }
}

/**
 * Creates an embed with a description
 * @param desc The embed description
 */
export const embedWithDescription = (desc: string): Embed => {
  return new Embed().setDescription(desc);
};

/**
 * Creates a primary embed
 * @param desc The embed description
 */
export const primaryEmbed = (desc: string): Embed => {
  return embedWithDescription(desc).setPrimaryColor();
};

/**
 * Creates a success embed
 * @param desc The embed description
 */
export const successEmbed = (desc: string): Embed => {
  return embedWithDescription(desc).setSuccessColor();
};

/**
 * Creates a warning embed
 * @param desc The embed description
 */
export const warningEmbed = (desc: string): Embed => {
  return embedWithDescription(desc).setWarningColor();
};

/**
 * Creates an danger embed
 * @param desc The embed description
 */
export const dangerEmbed = (desc: string): Embed => {
  return embedWithDescription(desc).setDangerColor();
};
