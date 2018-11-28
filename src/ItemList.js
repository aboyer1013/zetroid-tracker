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
		// const items = [...store.items.values()].filter(item => {
		// 	return item.group === 'mp-upgrade' || item.name === 'hookshot' || item.maxQty > 1
		// });
		const items = [...store.items.values()];
		const sortedItems = store.sortedItems;
		const itemGroups = store.groupedItems;
		// const itemElems = [];

		// Wrap additional markup if item is within a group.
		/*for (const key of Object.keys(itemGroups)) {
			if (key !== 'none') {
				itemElems.push(
					<div key={`group-${itemGroups[key].id}`} className="item-container">
						<div className="item-group">
							{itemGroups[key].map(item => <Item key={item.id} item={item} isVisible={store.isVisible(item)} />)}
						</div>
					</div>
				);
			} else {
				{itemGroups[key].forEach((item, i) => {
					itemElems.push(
						<div key={item.id} className="item-container">
							<Item item={item} isVisible={true} />
						</div>
					);
				})}
			}
		}*/
		return (
			<DragDropContext onDragEnd={this.onDragEndHandler}>
				<Droppable droppableId="droppable">
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
						>
							{store.sortOrder.map((index) => {
								const item = find([...store.items.values()], { index });

								return (
									<Draggable key={item.id} draggableId={item.id} index={index}>
										{(provided, snapshot) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
											>
												<Item item={item} isVisible={true}/>
											</div>
										)}
									</Draggable>
								);
							})}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		);
		/*return (
			<DragDropContext onDragEnd={() => this.onDragEndHandler}>
				<Droppable droppableId="itemList">
					{provided => {
						return (
							<div ref={provided.innerRef} className="item-list-container">
								{provided => {
									const itemElems = [];

									for (const key of Object.keys(itemGroups)) {
										let index = 0;

										if (key !== 'none') {
											itemElems.push(
												<Draggable key={`draggable-${index}`} draggableId={`draggable-${index}`} index={index}>
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														key={`group-${itemGroups[key].id}`}
														className="item-container"
													>
														<div className="item-group">
															{itemGroups[key].map(item => <Item key={item.id} item={item} isVisible={store.isVisible(item)}/>)}
														</div>
													</div>
												</Draggable>
											);
										} else {
											itemGroups[key].forEach((item, i) => {
												itemElems.push(
													<Draggable key={`draggable-${i}`} draggableId={`draggable-${i}`} index={i}>
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															key={item.id}
															className="item-container"
														>
															<Item item={item} isVisible={true}/>
														</div>
													</Draggable>
												);
											})
										}
										index++;
									}
									return itemElems;
								}}
								{provided.placeholder}
							</div>
						);
					}}
				</Droppable>
			</DragDropContext>
		);*/
	}
};

export default inject('store')(observer(ItemList));
