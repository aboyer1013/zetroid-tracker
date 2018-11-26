import React, { Component, createRef } from 'react';
import classNames from 'classnames';
import {inject, observer} from "mobx-react";

const NavBar = inject('store')(observer(class NavBar extends Component {
	constructor() {
		super();
		this.toggleMenu = this.toggleMenu.bind(this);
		this.toggleMapVisibility = this.toggleMapVisibility.bind(this);
		this.menu = createRef();
		this.burger = createRef();
	}

	state = {
		isMenuActive: false,
	}

	toggleMenu() {
		this.setState({isMenuActive: !this.state.isMenuActive});
	}

	toggleMapVisibility(mapName) {
		const map = this.props.store.getMapByName(mapName);

		map.setMapVisibility(!map.isVisible);
	}
	generateMapVisibilityButtons() {
		const buttons = [];

		[...this.props.store.maps.values()].forEach((map, i) => {
			const mapClasses = classNames('fas', {
				'fa-eye': !map.isVisible,
				'fa-eye-slash': map.isVisible,
			});

			buttons.push(
				<div key={`map-button-${map.id}`} className="navbar-item">
					<button onClick={() => map.setMapVisibility(!map.isVisible)} className="button">
						<span className="icon"><i className={mapClasses} /></span>
						<span>{map.longName}</span>
					</button>
				</div>
			);
		});
		return buttons;
	}
	render() {
		const burgerClasses = classNames('navbar-burger', 'burger', {'is-active': this.state.isMenuActive});
		const menuClasses = classNames('navbar-menu', {'is-active': this.state.isMenuActive});
		const mapVisibilityButtons = this.generateMapVisibilityButtons();

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
						<a className="navbar-item">
							Home
						</a>

						<div className="navbar-item has-dropdown is-hoverable">
							<a className="navbar-link">
								View
							</a>

							<div className="navbar-dropdown">
								{mapVisibilityButtons}
								<a className="navbar-item">
									Jobs
								</a>
								<a className="navbar-item">
									Contact
								</a>
								<hr className="navbar-divider" />
								<a className="navbar-item">
									Report an issue
								</a>
							</div>
						</div>
					</div>

					<div className="navbar-end">
						<div className="navbar-item">
							<div className="buttons">
								<a className="button is-primary">
									<strong>Sign up</strong>
								</a>
								<a className="button is-light">
									Log in
								</a>
							</div>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}));

export default NavBar;
