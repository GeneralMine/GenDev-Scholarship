module.exports = {
	log,
	client,
	warning,
	error,
	success,
};

function log(entity, action, ...message) {
	print(Style.log, parse("LOG", entity, action, message));
}

function client(entity, action, ...message) {
	print(Style.client, parse("CLIENT", entity, action, message));
}

function warning(entity, action, ...message) {
	print(Style.warning, parse("WARNING", entity, action, message));
}

function error(entity, action, ...message) {
	print(Style.error, parse("ERROR", entity, action, message));
}

function success(entity, action, ...message) {
	print(Style.success, parse("SUCCESS", entity, action, message));
}

function parse(stream, entity, action, ...message) {
	return `[${stream}][${entity}][${action}]: ${message}`;
}

const Style = {
	log: "\x1b[0m",
	client: "\x1b[34m",
	warning: "\x1b[33m",
	error: "\x1b[31m",
	success: "\x1b[32m",
};

function print(style, text) {
	console.log(style, text + "\x1b[0m");
}
