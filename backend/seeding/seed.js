const prisma = require("../src/lib/db");
const fs = require("fs");
const { parse } = require("csv-parse");

async function main() {
	console.time("seeding time");
	console.log("Current Hotel Count: ", await prisma.hotel.count());
	console.log("Seeding Hotels...");

	const hotelParser = fs.createReadStream("seeding/hotels.csv").pipe(parse({ columns: true }));
	let buffer1 = [];

	for await (const hotel of hotelParser) {
		const { id, name, latitude, longitude, category_stars } = hotel;
		buffer1.push({
			id: parseInt(id),
			name,
			latitude,
			longitude,
			category_stars: parseInt(category_stars),
		});
	}
	await prisma.hotel.createMany({ data: buffer1, skipDuplicates: true });
	buffer1 = [];
	console.log("Seeded Hotel Count: ", await prisma.hotel.count());
	console.log("Finished Seeding Hotels!");
	console.log("---");
	//console.log("Current Offer Count: ", await prisma.offer.count());
	console.log("Seeding Offers...");

	const offerParser = fs.createReadStream("seeding/offers.csv").pipe(parse({ columns: true }));
	let buffer2 = [];

	for await (const offer of offerParser) {
		const {
			hotelid,
			departuredate,
			returndate,
			countadults,
			countchildren,
			price,
			inbounddepartureairport,
			inboundarrivalairport,
			inboundairline,
			inboundarrivaldatetime,
			outbounddepartureairport,
			outboundarrivalairport,
			outboundairline,
			outboundarrivaldatetime,
			mealtype,
			oceanview,
			roomtype,
		} = offer;
		buffer2.push({
			departuredate,
			returndate,
			countadults: parseInt(countadults),
			countchildren: parseInt(countchildren),
			price: parseInt(price),
			inbounddepartureairport,
			inboundarrivalairport,
			inboundairline,
			inboundarrivaldatetime,
			outbounddepartureairport,
			outboundarrivalairport,
			outboundairline,
			outboundarrivaldatetime,
			mealtype,
			oceanview: oceanview === "true",
			roomtype,
			hotelid: parseInt(hotelid),
		});
		if (buffer2.length === 10000) {
			await prisma.offer.createMany({ data: buffer2, skipDuplicates: true });
			buffer2 = [];
		}
	}
	await prisma.offer.createMany({ data: buffer2, skipDuplicates: true });

	console.log("Seeded Offer Count: ", await prisma.offer.count());
	console.log("Finished Seeding Offers!");
	console.log("---");
	console.log("Finished Seeding!");
	console.timeEnd("seeding time");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.timeEnd("seeding time");
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
