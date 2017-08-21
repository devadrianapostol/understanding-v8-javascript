function print(message) {
	console.log(message);
}

function nestedFuntion(message) {
	
		function innerFunction2(message) {		
			print("innerFunction2");
			return message;
		}
	
		function innerFunction3(message) {
			print("innerFunction3");
			return message;
		}

		var button = document.getElementById('button');

		button.addEventListener('click', function clickButton(){ 
			innerFunction3('hola');
		}, false);
			
		return innerFunction2(message);
	}
	
	
	print(nestedFuntion("I am the full parsed function"));