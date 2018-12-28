import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import ItemList from 'components/ItemList';

class ItemSelectModal extends Component {
	render() {
		const { store } = this.props;

		return (
			<div className="modal-card item-select-modal">
				<header className="modal-card-head">
					<p className="modal-card-title">Item Select</p>
					<button className="delete" aria-label="close" onClick={store.closeModal} />
				</header>
				<section className="modal-card-body">
					<div className="content">
						<ItemList
							isSelectMode
							itemListStore={store}
							items={store.selectableItems}
						/>
					</div>
				</section>
				<footer className="modal-card-foot">
					<button className="button" onClick={() => {
						store.selectedAreaStore.selectItem(null);
						store.closeModal();
					}}>Clear Selection</button>
				</footer>
			</div>
		);
	}
}

export default inject('store')(observer(ItemSelectModal));
