import React, { Component } from 'react';
import Map from 'Map';
import { randomId } from './util';
import 'scss/App.scss';

class App extends Component {
	// constructor() {
	// 	super();
	// }

	componentDidMount() {
	}

	render() {
		return (
			<div>
				<Map id={randomId()} />
			</div>
		);
	}
}

export default App;
