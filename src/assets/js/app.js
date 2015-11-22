'use strict';

var aLongVariableName = 'it works!';
var anotherLongVariableName = 'it still works!';

console.log(aLongVariableName);

console.log(anotherLongVariableName);

var multiply = require('./multiply');
console.log(multiply.multiply(2, 3)); // => 2 * 3 = 6
