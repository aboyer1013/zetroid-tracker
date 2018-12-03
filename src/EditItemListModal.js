import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';
import ItemList from 'ItemList';
import { DragDropContext } from 'react-beautiful-dnd';
import { find } from 'lodash';

class EditItemListModal extends Component {
	constructor(props) {
		super(props);
		this.onDragEndHandler = this.onDragEndHandler.bind(this);
	}
	componentDidMount() {
		this.snapshot = getSnapshot(this.props.store);
	}
	onDragEndHandler(result) {
		if (!result.destination) {
			return;
		}
		const sourceStore = this.props.store.getItemListStoreByDroppableId(result.source.droppableId);
		const destStore = this.props.store.getItemListStoreByDroppableId(result.destination.droppableId);
		const sourceItems = sourceStore.sortedItems;
		const destItems = destStore.sortedItems;
		const sourceItem = find(sourceItems, { index: result.source.index });
		const destItem = find(destItems, { index: result.destination.index });
		if (result.source.droppableId === result.destination.droppableId) {
			// DnD within its own droppable area.
			destStore.updateOrder(sourceItem, destItem);
		} else {
			// DnD is being dropped into a droppable different than its own.
			destStore.moveItem(sourceItem, result.destination.index);
		}
	}
	render() {
		const store = this.props.store;
		const itemListStore = store.activeItemList;
		return (
			<div className="modal-card edit-item-list-modal">
				<header className="modal-card-head">
					<p className="modal-card-title">Customize Trackables</p>
					<button className="delete" aria-label="close" onClick={store.closeModal} />
				</header>
				<section className="modal-card-body">
					<div className="content">
						<p>Customize trackable items by dragging and dropping between both the <em>Active Items </em>
							and <em>Inactive Items</em> areas.</p>
						<div className="item-list-group-container">
							<h4>Items</h4>
							<DragDropContext onDragEnd={this.onDragEndHandler}>
								<div className="item-list-group active-item-list-group">
									<h5 className="item-list-group-subtitle">Active</h5>
									<ItemList
										itemListStore={itemListStore}
										items={itemListStore.sortedItems}
										direction={itemListStore.direction}
										isReadOnly={true}
										draggableEnabled={true}
									/>
								</div>
								<div className="icon item-exchange-divider"><i className="fas fa-exchange-alt" /></div>
								<div className="item-list-group inactive-item-list-group">
									<h5 className="item-list-group-subtitle">Inactive</h5>
									<ItemList
										itemListStore={store.inactiveItemList}
										items={store.inactiveItemList.sortedItems}
										isReadOnly={true}
										direction={itemListStore.direction}
										draggableEnabled={true}
									/>
								</div>
							</DragDropContext>
						</div>
						<div className="item-list-group-container">
							<h4>Bosses</h4>
							<DragDropContext onDragEnd={this.onDragEndHandler}>
								<div className="item-list-group active-item-list-group">
									<h5 className="item-list-group-subtitle">Active</h5>
									<ItemList
										itemListStore={store.activeBossItemList}
										items={store.activeBossItemList.bosses}
										direction={itemListStore.direction}
										isReadOnly={true}
										draggableEnabled={true}
									/>
								</div>
								<div className="icon item-exchange-divider"><i className="fas fa-exchange-alt" /></div>
								<div className="item-list-group inactive-item-list-group">
									<h5 className="item-list-group-subtitle">Inactive</h5>
									<ItemList
										itemListStore={store.inactiveBossItemList}
										items={store.inactiveBossItemList.bosses}
										isReadOnly={true}
										direction={itemListStore.direction}
										draggableEnabled={true}
									/>
								</div>
							</DragDropContext>
						</div>
					</div>
				</section>
				<footer className="modal-card-foot">
					<button className="button" onClick={() => {
						try {
							applySnapshot(this.props.store, this.snapshot);
						} catch (err) {
							console.error('There was a problem loading a previous state.', err);
						}
						store.closeModal();
					}}>Discard Changes</button>
				</footer>
			</div>
		);
	}
}

export default inject('store')(observer(EditItemListModal));
