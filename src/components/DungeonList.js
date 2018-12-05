import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Dungeon from "Dungeon";
import { find } from "lodash";

const DungeonList = items => {
  const result = [];
  // I'd move all these brains into a computed
  items.forEach((item, i) => {
    const dungeonLocation = find(
      this.props.store.dungeonLocations,
      loc => loc.boss.name === item.name
    );

    if (dungeonLocation) {
      result.push(
        <Dungeon
          key={item.id}
          loc={dungeonLocation}
          itemListStore={this.props.itemListStore}
        />
      );
    }
  });
  return (
    <div className="item-list-container dungeon-list-container is-draggable-disabled">
      {result}
    </div>
  );
};

export default inject("store")(observer(DungeonList));
