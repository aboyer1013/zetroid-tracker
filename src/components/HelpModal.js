import React from 'react';
import {observer, inject} from 'mobx-react';

const HelpModal = ({store}) => {
	const CLICK_TEXT = 'Click';
	const CTRL_CLICK_TEXT = 'Control / Command + Click';
	const detailsShortcut = store.config.quickMarkMode ? CTRL_CLICK_TEXT : CLICK_TEXT;
	const toggleCompleteShortcut = store.config.quickMarkMode ? CLICK_TEXT : CTRL_CLICK_TEXT;

	return (
		<div className="modal-card">
			<header className="modal-card-head">
				<p className="modal-card-title">Help</p>
				<button
					className="delete"
					aria-label="close"
					onClick={store.closeModal}
				/>
			</header>
			<section className="modal-card-body">
				<div className="content">
					<ul>
						<li>{detailsShortcut} map marker for more information (shown on Details panel).</li>
						<li>{toggleCompleteShortcut} map marker to toggle complete.</li>
						<li>Shift + drag to zoom in on an area. This is enabled if zooming is locked.</li>
						<li>Mousewheel to zoom.</li>
					</ul>
				</div>
			</section>
		</div>
	);
};

export default inject('store')(observer(HelpModal));
