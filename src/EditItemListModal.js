import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import ItemList from 'ItemList';
import classNames from 'classnames';

class EditItemListModal extends Component {
	constructor() {
		super();
		this.onDirectionChangeHandler = this.onDirectionChangeHandler.bind(this);
	}
	onDirectionChangeHandler(event) {
		this.props.store.itemList.setDirection(event.target.value)
	}
	render() {
		const store = this.props.store;
		const itemListStore = store.itemList;
		const ilgContainerClasses = classNames('item-list-group-container', {
			'is-vertical': itemListStore.direction === 'vertical',
			'is-horizontal': itemListStore.direction === 'horizontal',
		});

		return (
			<div className="modal-card edit-item-list-modal">
				<header className="modal-card-head">
					<p className="modal-card-title">Customize Item Panel</p>
					<button className="delete" aria-label="close" onClick={store.closeModal} />
				</header>
				<section className="modal-card-body">
					<div className="content">
						<div className="edit-item-list-controls columns">
							<div className="column">
								<div className="field">
									<div className="control">
										<label className="radio">
											<input onChange={this.onDirectionChangeHandler} checked={itemListStore.direction === 'horizontal'} type="radio" name="direction" value="horizontal" /> Horizontal
										</label>
									</div>
									<div className="control">
										<label className="radio">
											<input onChange={this.onDirectionChangeHandler} checked={itemListStore.direction === 'vertical'} type="radio" name="direction" value="vertical" /> Vertical
										</label>
									</div>
								</div>
							</div>
						</div>
						<div className={ilgContainerClasses}>
							<div className="item-list-group active-item-list-group">
								<h5>Active Set</h5>
								<ItemList
									itemListStore={itemListStore}
									items={itemListStore.sortedItems}
									direction={itemListStore.direction}
									droppableId="active-droppable"
									draggableEnabled={true}
								/>
							</div>
							<div className="item-list-group inactive-item-list-group">
								<h5>Available Items</h5>
								<ItemList
									itemListStore={store.inactiveItemList}
									items={store.inactiveItemList.sortedItems}
									direction={itemListStore.direction}
									droppableId="inactive-droppable"
									draggableEnabled={true}
								/>
							</div>
						</div>

					</div>
				</section>
				<footer className="modal-card-foot">
					<button className="button" onClick={store.closeModal}>Discard Changes</button>
				</footer>
			</div>
		);
	}
}

export default inject('store')(observer(EditItemListModal));
