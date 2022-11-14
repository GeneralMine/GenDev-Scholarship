const fs = require("fs");
const { parse } = require("csv-parse");
let airports = {};

fs.createReadStream("./offers2.csv")
	.pipe(parse({ delimiter: ",", from_line: 2 }))
	.on("data", function (row) {
		airports[row[16]] = null;
	})
	.on("end", function () {
		console.log(Object.keys(airports).length);
		console.log(Object.keys(airports));
		console.log("finished");
	})
	.on("error", function (error) {
		console.log(error.message);
	});
