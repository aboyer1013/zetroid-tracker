import React, {Component, createRef} from 'react';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import ConfigModal from 'components/ConfigModal';

const NavBar = class NavBar extends Component {
	constructor() {
		super();
		this.toggleMenu = this.toggleMenu.bind(this);
		this.toggleConfigModal = this.toggleConfigModal.bind(this);
		this.menu = createRef();
		this.burger = createRef();
	}

	state = {
		isMenuActive: false,
		isMenuOpen: false,
	};

	toggleMenu() {
		this.setState({isMenuActive: !this.state.isMenuActive});
	}

	toggleConfigModal() {
		const store = this.props.store;

		if (store.activeModal === 'CONFIG') {
			store.closeModal('CONFIG');
		} else {
			store.openModal('CONFIG');
		}
	}

	render() {
		const burgerClasses = classNames('navbar-burger', 'burger', {
			'is-active': this.state.isMenuActive,
		});
		const menuClasses = classNames('navbar-menu', {
			'is-active': this.state.isMenuActive,
		});
		const hideCompletedClasses = classNames('fas', {
			'fa-eye': this.props.store.hideCompleted,
			'fa-eye-slash': !this.props.store.hideCompleted,
		});
		const toggleBorderTopClasses = classNames('fas', {
			'fa-eye': !this.props.store.layout.showBorderTop,
			'fa-eye-slash': this.props.store.layout.showBorderTop,
		});
		const toggleBorderRightClasses = classNames('fas', {
			'fa-eye': !this.props.store.layout.showBorderRight,
			'fa-eye-slash': this.props.store.layout.showBorderRight,
		});
		const toggleBorderBottomClasses = classNames('fas', {
			'fa-eye': !this.props.store.layout.showBorderBottom,
			'fa-eye-slash': this.props.store.layout.showBorderBottom,
		});
		const toggleBorderLeftClasses = classNames('fas', {
			'fa-eye': !this.props.store.layout.showBorderLeft,
			'fa-eye-slash': this.props.store.layout.showBorderLeft,
		});
		const navbarClasses = classNames('navbar', 'is-fixed-bottom', {
			'is-menu-open': this.state.isMenuOpen,
			'is-menu-closed': !this.state.isMenuOpen,
		});
		const mainMenuButtonClasses = classNames('fas', {
			'fa-angle-double-left': this.state.isMenuOpen,
			'fa-angle-double-right': !this.state.isMenuOpen,
		})

		return (
			<div className="main-menu-container">
				<nav className={navbarClasses} role="navigation" aria-label="main navigation">
					<div ref={this.menu} className={menuClasses}>
						<button className="button main-menu-button is-primary" onClick={() => this.setState({isMenuOpen: !this.state.isMenuOpen})}>
							<span className="icon">
								<i className={mainMenuButtonClasses} />
							</span>
						</button>
						<div className="navbar-start">
							<div className="is-hideable-navbar-item navbar-item has-dropdown has-dropdown-up is-hoverable">
								<a className="navbar-link">File</a>

								<div className="navbar-dropdown">
									<a
										className="navbar-item"
										onClick={() => {
											this.setState({isMenuActive: false});
											this.props.store.openModal('FILE_IMPORT');
										}}
									>
										Import
									</a>
									<a
										className="navbar-item"
										onClick={() => {
											this.setState({isMenuActive: false});
											this.props.store.openModal('FILE_EXPORT');
										}}
									>
										Export
									</a>
								</div>
							</div>
							<div className="is-hideable-navbar-item navbar-item has-dropdown has-dropdown-up is-hoverable">
								<a className="navbar-link">Edit</a>

								<div className="navbar-dropdown">
									<a
										className="navbar-item"
										onClick={() => {
											this.setState({isMenuActive: false});
											this.props.store.openModal('EDIT_ITEM_LIST');
										}}
									>
										Customize Trackables
									</a>
								</div>
							</div>
							<div className="is-hideable-navbar-item navbar-item has-dropdown has-dropdown-up is-hoverable">
								<a className="navbar-link">View</a>

								<div className="navbar-dropdown">
									<div className="navbar-item">
										<button
											onClick={() =>
												this.props.store.setHideCompleted(
													!this.props.store.hideCompleted
												)
											}
											className="button is-fullwidth"
										>
						                    <span className="icon">
						                      <i className={hideCompletedClasses}/>
						                    </span>
											<span>Completed Locations</span>
										</button>
									</div>
									<div className="navbar-item">
										<button
											onClick={() =>
												this.props.store.layout.toggleBorder('Top')
											}
											className="button is-fullwidth"
										>
						                    <span className="icon">
						                      <i className={toggleBorderTopClasses}/>
						                    </span>
											<span>Top Border</span>
										</button>
									</div>
									<div className="navbar-item">
										<button
											onClick={() =>
												this.props.store.layout.toggleBorder('Right')
											}
											className="button is-fullwidth"
										>
						                    <span className="icon">
						                      <i className={toggleBorderRightClasses}/>
						                    </span>
											<span>Right Border</span>
										</button>
									</div>
									<div className="navbar-item">
										<button
											onClick={() =>
												this.props.store.layout.toggleBorder('Bottom')
											}
											className="button is-fullwidth"
										>
						                    <span className="icon">
						                      <i className={toggleBorderBottomClasses}/>
						                    </span>
											<span>Bottom Border</span>
										</button>
									</div>
									<div className="navbar-item">
										<button
											onClick={() =>
												this.props.store.layout.toggleBorder('Left')
											}
											className="button is-fullwidth"
										>
						                    <span className="icon">
						                      <i className={toggleBorderLeftClasses}/>
						                    </span>
											<span>Left Border</span>
										</button>
									</div>
								</div>
							</div>
							<div className="is-hideable-navbar-item navbar-item">
								<a
									className="navbar-item"
									onClick={() => this.props.store.openModal('HELP')}
								>
									Help
								</a>
							</div>
						</div>

						<div className="is-hideable-navbar-item navbar-end">
							<div className="navbar-item">
								<button className="button" onClick={this.toggleConfigModal}>
					                <span className="icon">
					                  <i className="fas fa-cog"/>
					                </span>
								</button>
							</div>
						</div>
					</div>
				</nav>
			</div>
		);
	}
};

export default inject('store')(observer(NavBar));
