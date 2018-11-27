import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';

class FileExportModal extends Component {
	// constructor() {
	// 	super();
	// 	this.snapshotRef = createRef();
	// }

	render() {
		return (
			<div className="modal-card">
				<header className="modal-card-head">
					<p className="modal-card-title">Export generated JSON</p>
					<button className="delete" aria-label="close" onClick={this.props.store.closeModal} />
				</header>
				<section className="modal-card-body">
					<p>Copy the JSON below to save the state of the application.</p>
					<div className="field">
						<div className="control">
							<textarea
								readOnly={true}
								className="is-fullwidth textarea"
								value={JSON.stringify(getSnapshot(this.props.store))}
							/>
						</div>
					</div>
				</section>
				<footer className="modal-card-foot">
					<button className="button is-success">Copy (not working, lol)</button>
					<button className="button" onClick={this.props.store.closeModal}>Cancel</button>
				</footer>
			</div>
		);
	}
}

export default inject('store')(observer(FileExportModal));
