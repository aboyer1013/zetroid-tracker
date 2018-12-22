import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';
import { parseInt, debounce } from 'lodash';

class ConfigModal extends Component {
	constructor(props) {
		super(props);
		this.splitterSizeChangeHandler = this.splitterSizeChangeHandler.bind(this);
		this.quickMarkModeChangeHandler = this.quickMarkModeChangeHandler.bind(this);
		this.splitterSizeChangeDebounced = debounce(this.changeSplitterSize, 300);
	}
	componentDidMount() {
		this.snapshot = getSnapshot(this.props.store);
	}
	splitterSizeChangeHandler(event) {
		this.splitterSizeChangeDebounced(event.target.value);
	}
	quickMarkModeChangeHandler(event) {
		const configStore = this.props.store.configStore;

		configStore.setQuickMarkMode(!configStore.quickMarkMode);
	}
	changeSplitterSize(newSize) {
		this.props.store.configStore.setSplitterSize(parseInt(newSize));
	}
	render() {
		const store = this.props.store;
		const configStore = store.config;

		return (
			<div className="modal-card config-modal">
				<header className="modal-card-head">
					<p className="modal-card-title">Settings</p>
					<button className="delete" aria-label="close" onClick={store.closeModal} />
				</header>
				<section className="modal-card-body">
					<div className="content">
						<div className="columns">
							<div className="column">
								<div className="field">
									<fieldset>
										<legend>Splitter size</legend>
										<label>
											<p className="has-text-grey">Adjust the size of the panel splitters for easier resizing.</p>
											<div className="splitter-size">
												<input
													type="range"
													className="range"
													min="10"
													max="20"
													step="1"
													defaultValue={configStore.splitterSize}
													onChange={this.splitterSizeChangeHandler}
												/>
												<p>{configStore.splitterSize}</p>
											</div>
										</label>
									</fieldset>
								</div>
								<div>
									<fieldset>
										<legend>Reset Current Game Settings</legend>
										<div className="field">
											<button
												onClick={this.props.store.flushGameTreeStorage}
												className="button is-danger"
											>
								                <span className="icon">
								                  <i className="fas fa-broom"/>
								                </span>
												<span>Reset Progression</span>
											</button>
										</div>
										<div className="field">
											<button
												onClick={this.props.store.flushGameLayoutStorage}
												className="button is-danger"
											>
								                <span className="icon">
								                  <i className="fas fa-broom"/>
								                </span>
												<span>Reset UI Settings</span>
											</button>
										</div>
										<div className="field">
											<button
												title="Reset progress, layout preferences, and settings."
												onClick={this.props.store.flushLocalStorage}
												className="button is-danger"
											>
								                <span className="icon">
								                  <i className="fas fa-broom"/>
								                </span>
												<span>Reset all settings</span>
											</button>
										</div>
									</fieldset>
								</div>
							</div>
							<div className="column">
								<div className="field quickmark-mode">
									<fieldset className="control">
										<legend>QuickMark Mode</legend>
										<div className="has-text-grey">
											<p>Left Click the map markers to view details about the location. CTRL + Click on the map markers to toggle completion.</p>
											<p>When QuickMark Mode is enabled, these shortcuts are swapped. This also applies to the progression button in the Details panel.</p>
										</div>
										<label>
											<input
												type="checkbox"
												className="checkbox"
												checked={configStore.quickMarkMode}
												onChange={this.quickMarkModeChangeHandler}
											/> Enabled
										</label>
									</fieldset>
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
