import { Logger } from "@nedbot/logger";

export const logger = new Logger({
  logFilesDirectory: "logs/main",
  mainLogFileName: "main.log",
  errorLogFileName: "errors.log",
  timestampFormat: "DD/MM/YYYY @ HH:mm:ss",
  fileDateFormat: "DD-MM-HH-YYYY",
  enableConsoleLogs: true,
  enableMainLogFile: true,
  enableErrorLogFile: true,
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d"
});

export const databaseLogger = new Logger({
  source: "Database",
  logFilesDirectory: "logs/database",
  mainLogFileName: "database.log",
  errorLogFileName: "database-errors.log",
  timestampFormat: "DD/MM/YYYY @ HH:mm:ss",
  fileDateFormat: "DD-MM-HH-YYYY",
  enableConsoleLogs: true,
  enableMainLogFile: true,
  enableErrorLogFile: true,
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d"
});

export const redisLogger = new Logger({
  source: "Redis",
  logFilesDirectory: "logs/redis",
  mainLogFileName: "redis.log",
  errorLogFileName: "redis-errors.log",
  timestampFormat: "DD/MM/YYYY @ HH:mm:ss",
  fileDateFormat: "DD-MM-HH-YYYY",
  enableConsoleLogs: true,
  enableMainLogFile: true,
  enableErrorLogFile: true,
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d"
});
