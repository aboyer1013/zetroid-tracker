import React, { Component, createRef } from "react";
import { observer, inject } from "mobx-react";

const HelpModal = ({ store }) => (
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
          <li>
            <em>Click map marker for more information.</em>
          </li>
          <li>
            <em>Shift + drag to zoom in on an area.</em>
          </li>
          <li>
            <em>Drag on the window title to move map.</em>
          </li>
          <li>
            <em>
              Mousewheel or{" "}
              <span className="icon">
                <i className="fas fa-search-minus" />
              </span>
              <span className="icon">
                <i className="fas fa-search-plus" />
              </span>{" "}
              to zoom in/out.
            </em>
          </li>
          <li>
            <em>
              Click{" "}
              <span className="icon">
                <i className="fas fa-lock" />
              </span>{" "}
              in upper right to toggle position lock.
            </em>
          </li>
        </ul>
      </div>
    </section>
  </div>
);

export default inject("store")(observer(HelpModal));
