const { PrismaClient } = require("@prisma/client");
const { readFileSync } = require("fs");

const prisma = new PrismaClient();

const readFile = (name) => {
  const out = "scripts/out";
  const data = readFileSync(`${out}/${name}`, "utf-8");
  return JSON.parse(data);
}

const main = async () => {
  await prisma.$connect();
  
  console.log("Migrating...");
  console.time("Elapsed");

  const guilds = readFile("guilds.json")
  console.log(`Found ${guilds.length} guilds`);

  const modlogs = readFile("modlogs.json")
  console.log(`Found ${modlogs.length} modlogs`);

  await prisma.guild.createMany({
    skipDuplicates: true,
    data: guilds.map(x => ({
      id: x.id,
      modlogCaseId: x.modlogCaseId,
      modlogChannelId: x.modlogChannelId,
      automodEnabledModules: ["PHISHING"]
    }))
  });

  console.log("Created guilds");

  await prisma.modlog.createMany({
    skipDuplicates: true,
    data: modlogs.map(x => ({
      id: x.id,
      caseId: x.caseId,
      caseType: x.caseType,
      offenderId: x.offenderId,
      moderatorId: x.moderatorId,
      messageId: x.messageId,
      reason: x.reason,
      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
      guildId: x.guildId
    }))
  });

  console.log("Created modlogs");

  console.timeEnd("Elapsed");
}

main()
.then(() => prisma.$disconnect())
.catch(console.error);