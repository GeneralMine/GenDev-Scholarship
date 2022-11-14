module.exports = { dateIsValid };

function dateIsValid(date) {
	return date instanceof Date && !isNaN(date);
}
