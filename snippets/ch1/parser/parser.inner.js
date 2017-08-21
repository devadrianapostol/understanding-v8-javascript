function nestedFuntion(message) {
	
		function innerFunction2(message) {		
			print("innerFunction2");
			return message;
		}
	
		function innerFunction3(message) {
			print("innerFunction3");
			return message;
		}
		
		return innerFunction2(message);
	}
	
	
	print(nestedFuntion("I am the full parsed function"));