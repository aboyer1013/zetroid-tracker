import React, { Component, createRef } from 'react';
import { observer, inject } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import classNames from 'classnames';

class FileExportModal extends Component {
	constructor(props) {
		super(props);
		this.textboxRef = createRef();
		this.copyToClipboard = this.copyToClipboard.bind(this);
		this.state = {
			hasBeenCopied: false,
		};
	}
	copyToClipboard() {
		this.textboxRef.current.select();
		document.execCommand('copy');
		this.setState({hasBeenCopied: true})
	}
	render() {
		const copyBtnClasses = classNames('button', {
			'is-primary': !this.state.hasBeenCopied,
			'is-success': this.state.hasBeenCopied,
		});
		const copyBtnTxt = this.state.hasBeenCopied ? 'Copied to Clipboard!' : 'Copy';

		return (
			<div className="modal-card">
				<header className="modal-card-head">
					<p className="modal-card-title">Export generated JSON</p>
					<button className="delete" aria-label="close" onClick={this.props.store.closeModal} />
				</header>
				<section className="modal-card-body">
					<p>Copy the JSON below to save the state of the application for the currently selected game ({this.props.store.selectedGame.longName}).</p>
					<div className="field">
						<div className="control">
							<textarea
								readOnly={true}
								ref={this.textboxRef}
								className="is-fullwidth textarea"
								value={JSON.stringify(getSnapshot(this.props.store))}
							/>
						</div>
					</div>
				</section>
				<footer className="modal-card-foot">
					<button className={copyBtnClasses} onClick={this.copyToClipboard}>{copyBtnTxt}</button>
					<button className="button" onClick={this.props.store.closeModal}>Cancel</button>
				</footer>
			</div>
		);
	}
}

export default inject('store')(observer(FileExportModal));
