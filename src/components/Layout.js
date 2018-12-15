import React, {Component, createRef} from 'react';
import { autorun } from 'mobx';
import {observer, inject} from 'mobx-react';
import FlexLayout from 'flexlayout-react';

const Layout = class Layout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			model: FlexLayout.Model.fromJson(this.props.store.layout.json)
		};
		this.props.layoutStore.layoutModel = this.state.model;
		this.props.layoutStore.Actions = FlexLayout.Actions;
		this.layoutRef = createRef();
		autorun(() => {
			this.state.model.doAction(FlexLayout.Actions.updateNodeAttributes('border_top', {show: this.props.layoutStore.showBorderTop}));
			this.state.model.doAction(FlexLayout.Actions.updateNodeAttributes('border_right', {show: this.props.layoutStore.showBorderRight}));
			this.state.model.doAction(FlexLayout.Actions.updateNodeAttributes('border_bottom', {show: this.props.layoutStore.showBorderBottom}));
			this.state.model.doAction(FlexLayout.Actions.updateNodeAttributes('border_left', {show: this.props.layoutStore.showBorderLeft}));
		});
	}

	render() {
		const self = this;
		// window.model = this.state.model;

		return (
			<div className="layout-container">
				<FlexLayout.Layout
					ref={this.layoutRef}
					model={this.state.model}
					factory={this.props.factory}
					onModelChange={model => {
						self.props.store.layout.saveToLocalStorage(model.toJson());
					}}
					onRenderTab={() => {
					}}
					onRenderTabSet={() => {
					}}
					classNameMapper={className => {
						// console.log(className);
						return className;
					}}
				/>
			</div>
		);
	}
};

export default inject('store')(observer(Layout));
