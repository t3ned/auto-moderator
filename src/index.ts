import "dotenv/config";
import "module-alias/register";

import { Client, config, consts } from "#lib";

const client = new Client(consts.clientOptions);
client.login(config.uri.discord);
