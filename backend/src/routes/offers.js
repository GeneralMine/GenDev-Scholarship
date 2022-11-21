/** @type {import("@prisma/client").PrismaClient} */
const prisma = require("../lib/db");
const logger = require("../lib/logger");
const { requiredFieldsInvalid, invalidFields } = require("../lib/validyChecker");
const { parseBody, parseStringToCharcode, parseCharcodeToString } = require("../lib/parser");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
module.exports = async (req, res) => {
	// check if required data is present
	if (requiredFieldsInvalid(req.body, true)) {
		logger.error("Search", "Request", "Missing required data in request!");
		return res.status(400).send("Missing required data in request!");
	}

	// parse data
	let body = parseBody(req.body);

	// check if data is valid
	if (invalidFields(body)) {
		logger.error("Search", "Request", "Invalid data in request!");
		return res.status(400).send("Invalid data in request!");
	}

	// get all offers by filter
	let offers = await prisma.offer.findMany({
		where: {
			AND: [
				{
					hotelId: body.hotelId,
				},
				{
					departureDateDay: body.exactDate ? body.departureDate.getDay() : { gte: body.departureDate.getDay(), lte: body.returnDate.getDay() },
					departureDateMonth: body.exactDate ? body.departureDate.getMonth() : { gte: body.departureDate.getMonth(), lte: body.returnDate.getMonth() },
					departureDateYear: body.exactDate ? body.departureDate.getFullYear() : { gte: body.departureDate.getFullYear(), lte: body.returnDate.getFullYear() },
				},
				{
					returnDateDay: body.exactDate ? body.returnDate.getDay() : { lte: body.returnDate.getDay(), gte: body.departureDate.getDay() },
					returnDateMonth: body.exactDate ? body.returnDate.getMonth() : { lte: body.returnDate.getMonth(), gte: body.departureDate.getMonth() },
					returnDateYear: body.exactDate ? body.returnDate.getFullYear() : { lte: body.returnDate.getFullYear(), gte: body.departureDate.getFullYear() },
				},
				{
					adults: body.adults,
					children: body.children,
				},
				{
					price: {
						gte: body.minPrice || 0,
						lte: body.maxPrice || 999999999,
					},
				},
				{
					OR: {
						outboundArrivalAirport: body.destinationAirport,
						outboundArrivalAirport: body.destinationAirport,
					},
				},
			],
		},
		orderBy: {
			price: "asc",
		},
		select: {
			adults: true,
			children: true,
			departureDate: true,
			inboundAirline: true,
			inboundArrivalAirport: true,
			inboundArrivalDatetime: true,
			inboundDepartureAirport: true,
			mealtype: true,
			oceanview: true,
			outboundAirline: true,
			outboundArrivalAirport: true,
			outboundArrivalDatetime: true,
			outboundDepartureAirport: true,
			price: true,
			returnDate: true,
			roomtype: true,
			hotelId: true,
		},
	});

	console.log(`Found ${offers.length} offers`);

	for (const offer of offers) {
		offer.inboundAirline = parseCharcodeToString(offer.inboundAirline);
		offer.inboundDepartureAirport = parseCharcodeToString(offer.inboundDepartureAirport);
		offer.inboundArrivalAirport = parseCharcodeToString(offer.inboundArrivalAirport);
		offer.outboundAirline = parseCharcodeToString(offer.outboundAirline);
		offer.outboundDepartureAirport = parseCharcodeToString(offer.outboundDepartureAirport);
		offer.outboundArrivalAirport = parseCharcodeToString(offer.outboundArrivalAirport);
	}

	const hotel = await prisma.hotel.findFirst({
		where: { hotelId: body.hotelId },
	});

	return res.status(200).json({ offers, hotel });
};
