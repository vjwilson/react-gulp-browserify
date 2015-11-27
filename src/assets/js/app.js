'use strict';

let aLongVariableName = 'it works!';
let anotherLongVariableName = 'it still works!';

console.log(aLongVariableName);

console.log(anotherLongVariableName);

var multiply = require('./multiply');
console.log(multiply.multiply(2, 3)); // => 2 * 3 = 6

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    render() {
        return <h1>{this.props.name}'s React!</h1>;
    }
}

ReactDOM.render(
    <App name="Van"/>,
    document.getElementById('react-root')
);
