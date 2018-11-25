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
				<Map
					id={randomId()}
					tileLayerTemplate={`${process.env.PUBLIC_URL}/img/maps/zelda3/lw/{z}/zelda3-lw.{x}.{y}.png`}
				/>
				<Map
					id={randomId()}
					tileLayerTemplate={`${process.env.PUBLIC_URL}/img/maps/zelda3/dw/{z}/zelda3-dw.{x}.{y}.png`}
				/>
			</div>
		);
	}
}

export default App;
