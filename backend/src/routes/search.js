/** @type {import("@prisma/client").PrismaClient} */
const prisma = require("../lib/db");
const logger = require("../lib/logger");
const { dateIsValid } = require("../lib/util");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
module.exports = async (req, res) => {
	// get data from request
	let { destinationAirport, homeAirport, departuredate, returndate, countadults, countchildren, mealtypes, roomtypes, oceanview, minPrice, maxPrice } = req.body;

	// check if required data is present
	if (!destinationAirport || !homeAirport || !departuredate || !returndate || !countadults || !countchildren) {
		logger.error("Search", "Request", "Missing required data in request!");
		return res.status(400).send("Missing required data in request!");
	}

	// parse data
	countadults = parseInt(countadults);
	countchildren = parseInt(countchildren);
	departuredate = new Date(departuredate);
	returndate = new Date(returndate);
	if (minPrice) minPrice = parseInt(minPrice);
	if (maxPrice) maxPrice = parseInt(maxPrice);
	if (oceanview === "true") oceanview = true;
	else oceanview = false;

	// check if data is valid
	if (
		countadults < 1 ||
		countchildren < 0 ||
		destinationAirport.length !== 3 ||
		homeAirport.length !== 3 ||
		!dateIsValid(departuredate) ||
		!dateIsValid(returndate) ||
		(minPrice && minPrice < 0) ||
		(maxPrice && maxPrice < 0) ||
		(minPrice && maxPrice && minPrice > maxPrice)
	) {
		logger.error("Search", "Request", "Invalid data in request!");
		return res.status(400).send("Invalid data in request!");
	}

	// get all offers by filter
	const offers = await prisma.offer.findMany({
		where: {
			AND: [
				{
					departuredate,
				},
				{
					returndate,
				},
				{
					countadults,
				},
				{
					countchildren,
				},
				{
					OR: {
						inboundarrivalairport: destinationAirport,
						outboundarrivalairport: destinationAirport,
					},
				},
			],
		},
		include: {
			hotel: true,
		},
	});

	console.log(offers);

	return res.status(200).json({ offers });
};
