import React from 'react';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';

const Modal = ({store, children}) => {
	const modalClasses = classNames('modal', {
		'is-active': store.isModalOpen
	});

	return (
		<div className={modalClasses}>
			<div className='modal-background'/>
			{children}
		</div>
	);
};

export default inject('store')(observer(Modal));
