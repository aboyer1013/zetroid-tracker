import React from 'react';
import { inject, observer } from 'mobx-react';
import ItemIcon from 'ItemIcon';

const LocationNotes = (props) => {
	const content = {
		pedestal: (<p>Can check with <ItemIcon item={props.store} />.</p>),
	};

	return content[props.name];
};

export default inject('store')(observer(LocationNotes));