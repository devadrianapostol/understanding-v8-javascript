function nestedFuntion(message) {

  var f1 = (function innerFunction3(message) {
    print("innerFunction3");
    return message;
  })();
 
  return f1;
}

print(nestedFuntion("I am the full parsed function"));