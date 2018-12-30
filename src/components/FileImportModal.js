import React, { Component, createRef } from 'react';
import { observer, inject } from 'mobx-react';
import { get } from 'lodash';
import { randomId } from '~/utilities/util';

class FileImportModal extends Component {
	constructor() {
		super();
		this.snapshotRef = createRef();
	}

	render() {
		const validationMessages = get(this, 'props.store.validationMessages', []);

		return (
			<div className="modal-card">
				<header className="modal-card-head">
					<p className="modal-card-title">Import generated JSON</p>
					<button type="button" className="delete" aria-label="close" onClick={this.props.store.closeModal} />
				</header>
				<section className="modal-card-body">
					<p>Paste JSON to load a previously saved state of the application.</p>
					<div className="field">
						<div className="control">
							<textarea
								className="is-fullwidth textarea"
								placeholder="Paste JSON here..."
								ref={this.snapshotRef}
							/>
						</div>
					</div>
					<div className="validation-error is-danger">
						{validationMessages.map(message => <p className="has-text-danger" key={`message-${randomId()}`}>{message}</p>)}
					</div>
				</section>
				<footer className="modal-card-foot">
					<button type="button" className="button is-success" onClick={() => this.props.store.loadSnapshot(this.snapshotRef.current.value)}>Load</button>
					<button type="button" className="button" onClick={this.props.store.closeModal}>Cancel</button>
				</footer>
			</div>
		);
	}
}

export default inject('store')(observer(FileImportModal));
