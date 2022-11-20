const fs = require("fs");
const { parse } = require("csv-parse");
const { stringify } = require("csv-stringify");
const geocoder = require("./geocoder");

const columns = ["id", "name", "latitude", "longitude", "category_stars", "country", "city", "state", "zipcode", "streetName", "streetNumber", "formattedAddress"];

let hotels = [];

async function reading() {
	console.log("Reading from file...");
	let blocked = true;
	const stream = await fs
		.createReadStream("../seedData/hotelsFeeded.csv")
		.pipe(await parse({ columns: true }))
		.on("data", async function (row) {
			hotels.push(row);
		})
		.on("end", async function () {
			console.log(`Read ${hotels.length} hotels`);
			blocked = false;
		})
		.on("error", async function (error) {
			console.log("Reading failed", error.message);
		});
	while (blocked) {
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
}

async function feeding() {
	console.log("Feeding hotels...");
	for (const hotel of hotels.filter((hotel) => hotel.city === "" && hotel.zipcode === "")) {
		console.log("Starting to feed hotel", hotel.id);
		const geo = await geocoder.reverse({ lat: hotel.latitude, lon: hotel.longitude });
		hotel.country = geo[0].country;
		hotel.city = geo[0].city;
		hotel.state = geo[0].state;
		hotel.zipcode = geo[0].zipcode;
		hotel.streetName = geo[0].streetName;
		hotel.streetNumber = geo[0].streetNumber;
		hotel.formattedAddress = geo[0].formattedAddress;
		console.log("Feeded hotel", hotel);
		await writing();
		await setTimeout(() => {}, 1500);
	}
	console.log("Feeding finished");
}

async function writing() {
	console.log("Writing to file...");
	const filename = "../seedData/hotelsFeeded.csv";
	const writableStream = fs.createWriteStream(filename);

	const stringifier = stringify({ header: true, columns: columns });
	for (const hotel of hotels) {
		stringifier.write(hotel);
	}
	stringifier.pipe(writableStream);
	console.log("Writing complete");
}

async function exec() {
	// Reading from file
	await reading();
	// Feeding
	await feeding();
	// Writing to file
	await writing();
}

exec();
