import React, { Component } from "react";
import { get } from "lodash";
import { inject, observer } from "mobx-react";
import classNames from "classnames";

const ItemIcon = ({ item, checkAcquired, children }) => {
  const imageSrc = item.imageSrc;
  const iconClasses = classNames("item-icon", {
    "is-not-acquired": !item.acquired && checkAcquired
  });

  return (
    <span className={iconClasses}>
      <img
        src={imageSrc}
        alt={get(item, "longName")}
        title={get(item, "longName")}
      />
      {children}
    </span>
  );
};

export default inject("store")(observer(ItemIcon));
