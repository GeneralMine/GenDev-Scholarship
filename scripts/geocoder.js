const NodeGeocoder = require("node-geocoder");

const options = {
	provider: "openstreetmap",
	formatter: null, // 'gpx', 'string', ...
};

module.exports = NodeGeocoder(options);
