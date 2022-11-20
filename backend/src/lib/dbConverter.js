module.exports = { parseStringToCharcode, parseCharcodeToString };

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
