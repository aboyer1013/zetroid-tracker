import React, { Component, createRef } from 'react';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import { get } from 'lodash';

const NavBar = class NavBar extends Component {
	constructor() {
		super();
		this.toggleMenu = this.toggleMenu.bind(this);
		this.menu = createRef();
		this.burger = createRef();
	}

	state = {
		isMenuActive: false,
	}

	toggleMenu() {
		this.setState({isMenuActive: !this.state.isMenuActive});
	}

	render() {
		const burgerClasses = classNames('navbar-burger', 'burger', {'is-active': this.state.isMenuActive});
		const menuClasses = classNames('navbar-menu', {'is-active': this.state.isMenuActive});
		const hideCompletedClasses = classNames('fas', {
			'fa-eye': this.props.store.hideCompleted,
			'fa-eye-slash': !this.props.store.hideCompleted,
		});

		return (
			<nav className="navbar" role="navigation" aria-label="main navigation">
				<div className="navbar-brand">
					<a className="navbar-item" href="#">
						<strong className="navbar-brand-title is-uppercase">Zetroid Tracker</strong>
					</a>

					<a onClick={this.toggleMenu} ref={this.burger} role="button" className={burgerClasses} aria-label="menu" aria-expanded="false"
					   data-target="navbarBasicExample">
						<span aria-hidden="true" />
						<span aria-hidden="true" />
						<span aria-hidden="true" />
					</a>
				</div>

				<div ref={this.menu} className={menuClasses}>
					<div className="navbar-start">
						<div className="navbar-item has-dropdown is-hoverable">
							<a className="navbar-link">File</a>

							<div className="navbar-dropdown">
								<a className="navbar-item" onClick={() => {
									this.setState({isMenuActive: false});
									this.props.store.openModal('FILE_IMPORT')
								}}>Import</a>
								<a className="navbar-item" onClick={() => {
									this.setState({isMenuActive: false});
									this.props.store.openModal('FILE_EXPORT')}
								}>Export</a>
							</div>
						</div>
						<div className="navbar-item has-dropdown is-hoverable">
							<a className="navbar-link">Edit</a>

							<div className="navbar-dropdown">
								<a className="navbar-item" onClick={() => {
									this.setState({isMenuActive: false});
									this.props.store.openModal('EDIT_ITEM_LIST')
								}}>Customize Trackables</a>
							</div>
						</div>
						<div className="navbar-item has-dropdown is-hoverable">
							<a className="navbar-link">View</a>

							<div className="navbar-dropdown">
								<div className="navbar-item">
									<button onClick={() => this.props.store.setHideCompleted(!this.props.store.hideCompleted)} className="button is-fullwidth">
										<span className="icon"><i className={hideCompletedClasses} /></span>
										<span>Completed Locations</span>
									</button>
								</div>
							</div>
						</div>
						<div className="navbar-item">
							<a className="navbar-item" onClick={() => this.props.store.openModal('HELP')}>Help</a>
						</div>
					</div>

					<div className="navbar-end">
						<div className="navbar-item">
							<button onClick={this.props.store.flushLocalStorage} className="button is-danger">
								<span className="icon"><i className="fas fa-broom" /></span>
								<span>Reset All</span>
							</button>
						</div>
						<div className="navbar-item">
							<button className="button">
								<span className="icon"><i className="fas fa-cog" /></span>
							</button>
						</div>
					</div>
				</div>
			</nav>
		);
	}
};

export default inject('store')(observer(NavBar));
