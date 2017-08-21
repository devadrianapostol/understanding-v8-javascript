function innerFunction(message) {
	return "Now I say " + message + " !!!";
}

function fullParsed(message) {
	// preParsedFunction(2, 5);
	return innerFunction("Hello " + message);
}

function preParsedFunction(a, b) {
	var length = 10;
	var update = [];
	for (var index = 0; index < length; index++) {
		update.push(a * b);
	}
	print("preParsedFunction");
	return update;
}

print(fullParsed("I am the full parsed function"));