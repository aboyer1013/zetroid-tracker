import React, { Component } from 'react';
import { get } from 'lodash';
import 'scss/App.scss';

class ItemIcon extends Component {
	render() {
		const item = this.props.item;
		const image = this.props.item.image;

		return (
			<span className="item-icon"><img src={image} alt={get(item, 'longName')} title={get(item, 'image')} /> <span>{item.longName}</span></span>
		);
	}
}

export default ItemIcon;
