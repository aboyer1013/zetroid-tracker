import React from 'react';
import { inject, observer } from 'mobx-react';
import ItemIcon from 'components/ItemIcon';
import { randomId } from 'utilities/util';

const LocationNotes = (props) => {
	const content = {
		pedestal: (<p key={`location-note-${randomId()}`}>Can check with <ItemIcon checkAcquired item={props.store.getItemOrGroupByName('book')} /></p>),
		kakarikoWell: (<p key={`location-note-${randomId()}`}>Requires one <ItemIcon item={props.store.getItemByName('bomb')} /></p>),
		bottleVendor: (<p key={`location-note-${randomId()}`}>Pay 100 Rupees</p>),
		raceMinigame: (<p key={`location-note-${randomId()}`}>Requires one <ItemIcon item={props.store.getItemByName('bomb')} /> or <ItemIcon checkAcquired item={props.store.getItemOrGroupByName('boots')} /></p>),
	};
	const selectedContent = props.notes.map(noteName => content[noteName]);

	return <div>{selectedContent}</div>;
};

export default inject('store')(observer(LocationNotes));