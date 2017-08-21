function Hidden(a, b) {
  this.a = a;
  this.b = b;
}

Hidden.prototype = {
  fancyFunction : function() { return this.x; }
}

for(let i = 0; i< 100000; i++) {
  let h = new Hidden(i, i);
  if( i > 8000 && i < 9000  ) {     
    if (!Hidden.prototype.deoptMethod) {
      print('trigger deopt');   
      Hidden.prototype.deoptMethod = function(){}
    }
  }
}
build()