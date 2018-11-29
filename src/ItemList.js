import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Item from 'Item';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { find } from 'lodash';

const ItemList = class ItemList extends Component {
	constructor() {
		super();
		this.onDragEndHandler = this.onDragEndHandler.bind(this);
	}
	onDragEndHandler(result) {
		if (!result.destination) {
			return;
		}
		const items = this.props.items;
		const sourceItem = find(items, { index: result.source.index });
		const destItem = find(items, { index: result.destination.index });

		this.props.store.itemList.updateOrder(sourceItem, destItem);
	}
	render() {
		const store = this.props.store.itemList;

		return (
			<DragDropContext onDragEnd={this.onDragEndHandler}>
				<Droppable droppableId="droppable">
					{(provided, snapshot) => {
						const dragElems = [];

						store.sortedItems.forEach((item, i) => {
							let itemElem = null;

							if (item.group) {
								itemElem = [...item.items.values()].map(subItem => {
									if (store.isVisible(subItem)) {
										return <Item key={subItem.id} item={subItem} isVisible={true} />
									}
									return null;
								});
							} else {
								itemElem = <Item key={item.id} item={item} isVisible={true} />;
							}
							dragElems.push(
								<Draggable key={`draggable-${i}`} draggableId={`draggable-${i}`} index={i}>
									{(provided, snapshot) => {
										return (
											<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
												<div className="item-container">
													{itemElem}
												</div>
											</div>
										);
									}}
								</Draggable>
							);
						});

						return (
							<div ref={provided.innerRef} className="item-list-container">
								{dragElems}
								{provided.placeholder}
							</div>
						);
					}}
				</Droppable>
			</DragDropContext>
		);
	}
};

export default inject('store')(observer(ItemList));
