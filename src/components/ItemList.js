import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import Item from './Item';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import {find,} from 'lodash';
import classNames from 'classnames';

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
		const sourceItem = find(items, {index: result.source.index});
		const destItem = find(items, {index: result.destination.index});

		this.props.itemListStore.updateOrder(sourceItem, destItem);
	}

	render() {
		const store = this.props.itemListStore;
		const dragElems = [];
		const containerClasses = classNames('item-list-container', {
			'is-draggable-enabled': this.props.draggableEnabled,
			'is-draggable-disabled': !this.props.draggableEnabled,
		});

		this.props.items.forEach((item, i) => {
			let itemElem = null;

			if (item.group) {
				itemElem = store.getItemsByGroup(item.group).map(subItem => <Item isReadOnly={this.props.isReadOnly}
				                                                                  itemListStore={store} key={subItem.id}
				                                                                  item={subItem}/>);
			} else {
				itemElem = <Item isReadOnly={this.props.isReadOnly} itemListStore={store} key={item.id} item={item}/>;
			}
			if (!this.props.draggableEnabled) {
				dragElems.push(
					<div key={`item-${i}`} className='item-container'>
						{itemElem}
					</div>
				);
			} else {
				dragElems.push(
					<Draggable key={`draggable-${i}`}
					           draggableId={`${this.props.itemListStore.droppableId}-draggable-${i}`} index={i}>
						{(provided, snapshot) => {
							return (
								<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
									<div className='item-container'>
										{itemElem}
									</div>
								</div>
							);
						}}
					</Draggable>
				);
			}
		});
		if (!this.props.draggableEnabled) {
			return (
				<div className={containerClasses}>
					{dragElems}
				</div>
			);
		}
		return (
			<Droppable droppableId={this.props.itemListStore.droppableId || 'droppable'} direction='horizontal'>
				{(provided, snapshot) => {
					return (
						<div ref={provided.innerRef} className={containerClasses}>
							{dragElems}
							{provided.placeholder}
						</div>
					);
				}}
			</Droppable>
		);
	}
};

export default inject('store')(observer(ItemList));
