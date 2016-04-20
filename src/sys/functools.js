//http://www.html5rocks.com/en/tutorials/workers/basics/
function map (fn, arr){
   // var t0 = new Worker("t0.js");
   // w.onmessage = fn;
   // w.postMessage(arr.buffer); 
   return arr.map(fn); 
}

function reduce (fn, arr){
    return arr.reduce(fn); 
}

function op(operation, value){
    switch (operation) {
    case '*':
	return function(x){return x*value};
    case '/':
	return function(x){return x/value};
    case '+':
	return function(x){return x+value};	
    case '-':
	return function(x){return x-value};
    case 'pow':
	return function(x){return Math.pow(x,value)};
    default: 
	throw new Error("Op: Invalid operation specified!")
    }
}

