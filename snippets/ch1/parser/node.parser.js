function innerFunction(message) {
	return "Now I say " + message + " !!!";
}

function fullParsed(message) {
	setTimeout(function() {
		preParsedFunction();
	}, 2000);
	preParsedFunction();
	return innerFunction("Hello " + message);
}

function preParsedFunction() {
	console.log("preParsedFunction");
}

console.log(fullParsed("I am the full parsed function"));