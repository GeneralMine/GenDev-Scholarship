const express = require("express");
const app = express();
const dbtester = require("./lib/dbtester");
const prisma = require("./lib/db");
const cors = require("cors");
// Setup env
const PORT = process.env.PORT || 8080;

async function startup() {
	await dbtester();
	app.enable("trust proxy");
	app.use(express.json());
	app.use(cors());
	/*
	 * Public Routes
	 */

	app.get("/", (req, res) => {
		res.send("Hello World!");
	});

	app.post("/hotels", require("./routes/hotels"));
	app.post("/offers", require("./routes/offers"));

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
