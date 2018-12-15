import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';
import { parseInt, debounce } from 'lodash';

class ConfigModal extends Component {
	constructor(props) {
		super(props);
		this.splitterSizeChangeHandler = this.splitterSizeChangeHandler.bind(this);
		this.splitterSizeChangeDebounced = debounce(this.changeSplitterSize, 300);
	}
	componentDidMount() {
		this.snapshot = getSnapshot(this.props.store);
	}
	splitterSizeChangeHandler(event) {
		this.splitterSizeChangeDebounced(event.target.value);
	}
	changeSplitterSize(newSize) {
		this.props.store.configStore.setSplitterSize(parseInt(newSize));
	}
	render() {
		const store = this.props.store;
		const configStore = store.configStore;

		return (
			<div className="modal-card config-modal">
				<header className="modal-card-head">
					<p className="modal-card-title">Settings</p>
					<button className="delete" aria-label="close" onClick={store.closeModal} />
				</header>
				<section className="modal-card-body">
					<div className="content">
						<div className="columns">
							<div className="field column">
								<div className="control">
									<label>
										<p>Splitter size</p>
										<div className="splitter-size">
											<input
												type="range"
												className="range"
												min="5"
												max="20"
												step="1"
												defaultValue={configStore.splitterSize}
												onChange={this.splitterSizeChangeHandler}
											/>
											<p>{configStore.splitterSize}</p>
										</div>
									</label>
								</div>
							</div>
							<div className="field column">
								<div className="notification is-danger">
									<p>Warning! This will erase all game progression, layout preferences, and settings.</p>
									<button
										title="Reset progress, layout preferences, and settings."
										onClick={this.props.store.flushLocalStorage}
										className="button"
									>
							                <span className="icon">
							                  <i className="fas fa-broom"/>
							                </span>
										<span>I understand. Reset everything to defaults.</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</section>
				<footer className="modal-card-foot">
					<button className="button" onClick={() => {
						try {
							applySnapshot(this.props.store, this.snapshot);
						} catch (err) {
							console.error('There was a problem loading a previous state.', err);
						}
						store.closeModal();
					}}>Discard Changes</button>
				</footer>
			</div>
		);
	}
}

export default inject('store')(observer(ConfigModal));
