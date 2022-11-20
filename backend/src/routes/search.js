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
	let { destinationAirport, homeAirport, departuredate, returndate, countadults: countAdults, countchildren: countChildren, mealtypes, roomtypes, oceanview, minPrice, maxPrice } = req.body;

	// check if required data is present
	if (!destinationAirport || !homeAirport || !departuredate || !returndate || !countAdults || !countChildren) {
		logger.error("Search", "Request", "Missing required data in request!");
		return res.status(400).send("Missing required data in request!");
	}

	// parse data
	destinationAirport = parseStringToCharcode(destinationAirport);
	homeAirport = parseStringToCharcode(homeAirport);
	countAdults = parseInt(countAdults);
	countChildren = parseInt(countChildren);
	departuredate = new Date(departuredate);
	returndate = new Date(returndate);
	if (minPrice) minPrice = parseInt(minPrice);
	if (maxPrice) maxPrice = parseInt(maxPrice);
	if (oceanview === "true") oceanview = true;
	else oceanview = false;

	// check if data is valid
	if (
		countAdults < 1 ||
		countChildren < 0 ||
		!dateIsValid(departuredate) ||
		!dateIsValid(returndate) ||
		(minPrice && minPrice < 0) ||
		(maxPrice && maxPrice < 0) ||
		(minPrice && maxPrice && minPrice > maxPrice)
	) {
		logger.error("Search", "Request", "Invalid data in request!");
		return res.status(400).send("Invalid data in request!");
	}

	console.log("Searching for flights...", destinationAirport, homeAirport, departuredate, returndate, countAdults, countChildren, mealtypes, roomtypes, oceanview, minPrice, maxPrice);
	// get all offers by filter
	const offers = await prisma.offer.findMany({
		where: {
			AND: [
				{
					departureDateDay: departuredate.getDay(),
					departureDateMonth: departuredate.getMonth(),
					departureDateYear: departuredate.getFullYear(),
				},
				{
					returnDateDay: returndate.getDay(),
					returnDateMonth: returndate.getMonth(),
					returnDateYear: returndate.getFullYear(),
				},
				{
					countAdults,
				},
				{
					countChildren,
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

	console.log(offers);

	return res.status(200).json({ offers });
};
