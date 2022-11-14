const express = require("express");
const app = express();
const dbtester = require("./lib/dbtester");
const prisma = require("./lib/db");
// Setup env
const PORT = process.env.PORT || 8080;

async function startup() {
	await dbtester();
	//app.enable('trust proxy');
	app.use(express.json());

	/*
	 * Public Routes
	 */

	app.get("/", (req, res) => {
		res.send("Hello World!");
	});

	app.post("/search", require("./routes/search"));

	app.listen(PORT, () => {
		console.log(`listening at http://localhost:${PORT}`);
	});
}

startup()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
