'use strict';

let aLongVariableName = 'it works!';
let anotherLongVariableName = 'it still works!';

console.log(aLongVariableName);

console.log(anotherLongVariableName);

var multiply = require('./multiply');
console.log(multiply.multiply(2, 3)); // => 2 * 3 = 6
