/** @type {import("@prisma/client").PrismaClient} */
const prisma = require("./db");
const logger = require("./logger");

module.exports = async function () {
	let connected = false;
	while (!connected) {
		logger.log("Database", "Connection", "Trying to connect to Database...");
		try {
			await prisma["hotel"].findMany();
			logger.log("Database", "Info", "Database Stats:");
			await countEntitiy("hotel");
			await countEntitiy("offer");
			connected = true;
		} catch (error) {
			logger.error("Database", "Connection", "Database connection failed. \n\t\t\t\tDatabase may not exist or isnt synced! \n\t\t\t\tRetrying in 5 seconds...");
			logger.error(error);
			await new Promise((resolve) => setTimeout(resolve, 5000));
		}
	}
	logger.success("Database", "Connection", "Connection established and testet!");
};

async function countEntitiy(entity) {
	logger.log("Database", "Info", `\t${(await prisma[entity].findMany()).length} ${entity}s`);
}
