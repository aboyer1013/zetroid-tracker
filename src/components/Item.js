import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import classNames from "classnames";

const Item = ({ isReadOnly = false, item, itemListStore }) => {
  const isVisible = itemListStore.isVisible(item);
  const itemClasses = classNames("item", {
    "is-not-acquired": !item.acquired,
    "is-hidden": !isVisible,
    "is-item-group": !!item.group
  });
  let imageSrc = item.imageSrc;

  if (item.isChest && item.qty < 1) {
    imageSrc = item.imageEmptySrc;
  }

  return (
    <div
      data-qty={item.qty}
      onClick={event => {
        if (!this.props.isReadOnly) {
          if (item.isChest) {
            item.activateNext(event.shiftKey);
          } else {
            item.activateNext(!event.shiftKey);
          }
        }
      }}
      key={item.id}
      className={itemClasses}
    >
      <img src={imageSrc} alt={item.longName} title={item.longName} />
    </div>
  );
};

export default inject("store")(observer(Item));
