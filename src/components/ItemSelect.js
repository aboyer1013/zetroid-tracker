import React from 'react';
import {observer, inject} from 'mobx-react';
import classNames from 'classnames';
import Item from 'components/Item';

const ItemSelect = ({ store }) => {
	return (
		<div className="item item-select" onClick={() => store.openModal('ITEM_SELECT')}>
			<span className="item-select-plus"><i className="fas fa-plus has-text-info" /></span>
		</div>
	);
};

export default inject('store')(observer(ItemSelect));
