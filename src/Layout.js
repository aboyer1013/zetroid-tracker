import React, { Component, createRef } from 'react';
import { observer, inject } from 'mobx-react';
import FlexLayout from 'flexlayout-react';
import '../node_modules/flexlayout-react/style/dark.css';

const Layout = class Layout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			model: FlexLayout.Model.fromJson(this.props.store.layout.json),
		}
		this.layoutRef = createRef();
	}
	componentDidMount() {
		// debugger;
	}

	render() {
		return (
			<div className="layout-container">
				<FlexLayout.Layout
					ref={this.layoutRef}
					model={this.state.model}
					factory={this.props.factory}
				/>
			</div>
		);
	}
};

export default inject('store')(observer(Layout));
