import React from 'react';
import { inject, observer } from 'mobx-react';
import ItemIcon from 'ItemIcon';
import { randomId } from './util';

const LocationNotes = (props) => {
	const content = {
		pedestal: (<p key={`location-note-${randomId()}`}>Can check with <ItemIcon checkAcquired item={props.store.getItemOrGroupByName('book')} />.</p>),
	};
	const selectedContent = props.notes.map(noteName => content[noteName]);

	return <div>{selectedContent}</div>;
};

export default inject('store')(observer(LocationNotes));