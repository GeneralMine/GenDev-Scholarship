const geocoder = require("./geocoder");

async function exec() {
	let response = await geocoder.reverse({ lat: "39.75484674", lon: "2.681373263" });

	console.log(response);
}

exec();
