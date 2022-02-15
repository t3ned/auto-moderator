const { PrismaClient } = require("@prisma/client");
const { writeFileSync, mkdirSync } = require("fs");

const prisma = new PrismaClient();

const writeFile = (name, data) => {
  writeFileSync(name, JSON.stringify(data));
}

const main = async () => {
  await prisma.$connect();
  
  console.log("Dumping database contents");
  console.time("Elapsed");

  const guilds = await prisma.guild.findMany();
  console.log(`Found ${guilds.length} guilds`);

  const modlogs = await prisma.modlog.findMany();
  console.log(`Found ${modlogs.length} modlogs`);

  const out = "scripts/out";

  mkdirSync(out, { recursive: true });

  writeFile(`${out}/guilds.json`, guilds);
  console.log(`Created ${out}/guilds.json`);

  writeFile(`${out}/modlogs.json`, modlogs);
  console.log(`Created ${out}/modlogs.json`);

  console.timeEnd("Elapsed");
}

main()
.then(() => prisma.$disconnect())
.catch(console.error);