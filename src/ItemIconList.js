import React, { Component } from 'react';
import ItemIcon from 'ItemIcon';
import { get } from 'lodash';
import 'scss/App.scss';

class ItemIconList extends Component {
	render() {
		if (!this.props.items) {
			return <span>None</span>;
		}
		if (this.props.items.length === 1) {
			return <ItemIcon item={this.props.items[0]} />;
		}
		const icons = [];
		const iconText = [];
		const result = [];
		this.props.items.forEach((item, i) => {
			icons.push(<span key={`${item.name}-icon-${i}`} className="item-icon is-not-acquired"><img src={item.image} alt={get(item, 'longName')} title={get(item, 'image')} /></span>);
			iconText.push(<span key={`${item.name}-text-${i}`} className="item-icon-name is-not-acquired is-size-7">{item.longName}</span>);
		});
		icons.forEach((icon, i) => {
			result.push(icons[i], iconText[i]);
		});
		return (
			<div className="item-icon-list">{result}</div>
		);
	}
}

export default ItemIconList;
