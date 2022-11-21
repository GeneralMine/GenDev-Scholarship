module.exports = {
	requiredFieldsInvalid,
	invalidFields,
};

function requiredFieldsInvalid(body, checkHotelId = false) {
	if (!body.destinationAirport || !body.homeAirport || !body.departureDate || !body.returnDate || body.adults === null || body.children === null || (checkHotelId && !body.hotelId)) {
		return true;
	}
}

function dateIsValid(date) {
	return date instanceof Date && !isNaN(date);
}

function invalidFields(body) {
	if (
		body.adults < 1 ||
		body.children < 0 ||
		body.hotelId < 0 ||
		!dateIsValid(body.departureDate) ||
		!dateIsValid(body.returnDate) ||
		(body.minPrice && body.minPrice < 0) ||
		(body.maxPrice && body.maxPrice < 0) ||
		(body.minPrice && body.maxPrice && body.minPrice > body.maxPrice) ||
		(body.minStars && body.minStars < 0) ||
		(body.maxStars && body.maxStars < 0) ||
		(body.minStars && body.maxStars && body.minStars > body.maxStars)
	)
		return true;
}
