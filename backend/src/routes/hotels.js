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
	if (requiredFieldsInvalid(req.body)) {
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
	let hotels = await (
		await prisma.offer.groupBy({
			by: ["hotelId", "price"],
			where: {
				AND: [
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
						OR: {
							outboundArrivalAirport: body.destinationAirport,
							outboundArrivalAirport: body.destinationAirport,
						},
					},
				],
			},
			_count: {
				_all: true,
			},
			_min: {
				price: true,
			},
			having: {
				price: {
					gte: body.minPrice || 0,
					lte: body.maxPrice || 999999999,
				},
			},
			orderBy: {
				price: "asc",
			},
		})
	).map(async (d) => {
		const hotel = await prisma.hotel.findFirst({
			where: { hotelId: d.hotelId, category_stars: { gte: body.minStars || 0, lte: body.maxStars || 5 } },
			select: {
				name: true,
				category_stars: true,
				city: true,
				state: true,
			},
		});
		if (hotel) {
			return { ...d, ...hotel };
		} else return null;
	});

	// await all promises
	hotels = await Promise.all(hotels);

	hotels = hotels.filter((d) => d !== null);
	// Format data
	hotels = hotels.map((d) => {
		return {
			hotelId: d.hotelId,
			name: d.name,
			category_stars: d.category_stars,
			city: d.city,
			state: d.state,
			minPrice: d._min.price,
			offersCount: d._count._all,
		};
	});

	console.log(`Found ${hotels.length} hotels`);

	return res.status(200).json({ hotels });
};
