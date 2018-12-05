import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import classNames from "classnames";

const Modal = ({ store, children }) => {
  const modalClasses = classNames("modal", {
    "is-active": this.props.store.isModalOpen
  });

  return (
    <div className={modalClasses}>
      <div className="modal-background" />
      {this.props.children}
    </div>
  );
};

export default inject("store")(observer(Modal));
