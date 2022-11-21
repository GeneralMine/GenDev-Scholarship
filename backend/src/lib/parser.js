module.exports = {
	parseBody,
	parseCharcodeToString,
	parseStringToCharcode,
};

// Parse and cleanup body
function parseBody(body) {
	let newBody = {};

	newBody.destinationAirport = parseStringToCharcode(body.destinationAirport);
	newBody.homeAirport = parseStringToCharcode(body.homeAirport);
	newBody.adults = parseInt(body.adults);
	newBody.children = parseInt(body.children);
	newBody.departureDate = new Date(body.departureDate);
	newBody.returnDate = new Date(body.returnDate);
	if (body.hotelId) newBody.hotelId = parseInt(body.hotelId);
	if (body.minPrice) newBody.minPrice = parseInt(body.minPrice);
	if (body.maxPrice) newBody.maxPrice = parseInt(body.maxPrice);
	if (body.minStars) newBody.minStars = parseInt(body.minStars);
	if (body.maxStars) newBody.maxStars = parseInt(body.maxStars);
	if (body.oceanview === "true") {
		newBody.oceanview = true;
	} else {
		newBody.oceanview = false;
	}
	if (body.exactDate === "true") {
		newBody.exactDate = true;
	} else {
		newBody.exactDate = false;
	}
	if (body.roomtype) newBody.roomtype = body.roomtype;
	if (body.mealtype) newBody.mealtype = body.mealtype;

	return newBody;
}

// "HAM" -> 726577
function parseStringToCharcode(str) {
	return parseInt(
		str
			.split("")
			.map((char) => char.charCodeAt(0))
			.join("")
	);
}

// 726577 -> "HAM"
function parseCharcodeToString(code) {
	return String.fromCharCode(...code.toString().match(/.{1,2}/g));
}
