const prisma = require("../src/lib/db");
const fs = require("fs");
const { parse } = require("csv-parse");
const { parseStringToCharcode } = require("../src/lib/dbConverter");

async function main() {
	console.time("seeding time");
	console.log("Current Hotel Count: ", await prisma.hotel.count());
	console.log("Seeding Hotels...");

	const hotelParser = fs.createReadStream("../seedData/hotels.csv").pipe(parse({ columns: true }));
	let buffer1 = [];

	for await (const hotel of hotelParser) {
		buffer1.push({
			id: parseInt(hotel.id),
			name: hotel.name,
			latitude: hotel.latitude,
			longitude: hotel.longitude,
			category_stars: parseInt(hotel.category_stars),
		});
	}
	await prisma.hotel.createMany({ data: buffer1, skipDuplicates: true });
	buffer1 = [];
	console.log("Seeded Hotel Count: ", await prisma.hotel.count());
	console.log("Finished Seeding Hotels!");
	console.log("---");
	console.log("Current Offer Count: ", await prisma.offer.count());
	console.log("Seeding Offers...");

	const offerParser = fs.createReadStream("../seedData/offers100k.csv").pipe(parse({ columns: true }));
	let buffer2 = [];

	for await (const offer of offerParser) {
		const departureDate = new Date(offer.departuredate);
		const returnDate = new Date(offer.returndate);
		buffer2.push({
			hotelId: parseInt(offer.hotelid),
			departureDateDay: parseInt(departureDate.getDay()),
			departureDateMonth: parseInt(departureDate.getMonth()),
			departureDateYear: parseInt(departureDate.getFullYear()),
			departureDate,
			returnDateDay: parseInt(returnDate.getDay()),
			returnDateMonth: parseInt(returnDate.getMonth()),
			returnDateYear: parseInt(returnDate.getFullYear()),
			returnDate,
			adults: parseInt(offer.countadults),
			children: parseInt(offer.countchildren),
			price: parseInt(offer.price),
			inboundDepartureAirport: parseStringToCharcode(offer.inbounddepartureairport),
			inboundArrivalAirport: parseStringToCharcode(offer.inboundarrivalairport),
			inboundArrivalDatetime: offer.inboundarrivaldatetime,
			inboundAirline: parseStringToCharcode(offer.inboundairline),
			outboundDepartureAirport: parseStringToCharcode(offer.outbounddepartureairport),
			outboundArrivalAirport: parseStringToCharcode(offer.outboundarrivalairport),
			outboundArrivalDatetime: offer.outboundarrivaldatetime,
			outboundAirline: parseStringToCharcode(offer.outboundairline),
			mealtype: offer.mealtype,
			oceanview: offer.oceanview === "true",
			roomtype: offer.roomtype,
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
