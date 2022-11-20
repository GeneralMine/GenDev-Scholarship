/** @type {import("@prisma/client").PrismaClient} */
const prisma = require("../lib/db");
const logger = require("../lib/logger");
const { dateIsValid } = require("../lib/util");
const { parseStringToCharcode, parseCharcodeToString } = require("../lib/dbConverter");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
module.exports = async (req, res) => {
	// get data from request
	let { destinationAirport, homeAirport, departureDate, returnDate, adults, children, mealtypes, roomtypes, oceanview, minPrice, maxPrice } = req.body;

	// check if required data is present
	if (!destinationAirport || !homeAirport || !departureDate || !returnDate || adults === null || children === null) {
		logger.error("Search", "Request", "Missing required data in request!");
		return res.status(400).send("Missing required data in request!");
	}

	// parse data
	destinationAirport = parseStringToCharcode(destinationAirport);
	homeAirport = parseStringToCharcode(homeAirport);
	adults = parseInt(adults);
	children = parseInt(children);
	departureDate = new Date(departureDate);
	returnDate = new Date(returnDate);
	if (minPrice) minPrice = parseInt(minPrice);
	if (maxPrice) maxPrice = parseInt(maxPrice);
	if (oceanview === "true") oceanview = true;
	else oceanview = false;

	// check if data is valid
	if (
		adults < 1 ||
		children < 0 ||
		!dateIsValid(departureDate) ||
		!dateIsValid(returnDate) ||
		(minPrice && minPrice < 0) ||
		(maxPrice && maxPrice < 0) ||
		(minPrice && maxPrice && minPrice > maxPrice)
	) {
		logger.error("Search", "Request", "Invalid data in request!");
		return res.status(400).send("Invalid data in request!");
	}

	console.log("Searching for flights...", destinationAirport, homeAirport, departureDate, returnDate, adults, children, mealtypes, roomtypes, oceanview, minPrice, maxPrice);
	// get all offers by filter
	const offers = await prisma.offer.findMany({
		where: {
			AND: [
				{
					departureDateDay: departureDate.getDay(),
					departureDateMonth: departureDate.getMonth(),
					departureDateYear: departureDate.getFullYear(),
				},
				{
					returnDateDay: returnDate.getDay(),
					returnDateMonth: returnDate.getMonth(),
					returnDateYear: returnDate.getFullYear(),
				},
				{
					adults,
				},
				{
					children,
				},
				{
					OR: {
						outboundArrivalAirport: destinationAirport,
						outboundArrivalAirport: destinationAirport,
					},
				},
			],
		},
		include: {
			hotel: true,
		},
		take: 25,
	});

	// parse data from db
	offers.forEach((offer) => {
		offer.inboundDepartureAirport = parseCharcodeToString(offer.inboundDepartureAirport);
		offer.inboundArrivalAirport = parseCharcodeToString(offer.inboundArrivalAirport);
		offer.inboundAirline = parseCharcodeToString(offer.inboundAirline);
		offer.outboundDepartureAirport = parseCharcodeToString(offer.outboundDepartureAirport);
		offer.outboundArrivalAirport = parseCharcodeToString(offer.outboundArrivalAirport);
		offer.outboundAirline = parseCharcodeToString(offer.outboundAirline);
		delete offer.departureDateDay;
		delete offer.departureDateMonth;
		delete offer.departureDateYear;
		delete offer.returnDateDay;
		delete offer.returnDateMonth;
		delete offer.returnDateYear;
	});

	console.log(offers);

	return res.status(200).json({ offers });
};
