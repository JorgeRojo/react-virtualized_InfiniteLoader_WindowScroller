import React, { useState, useRef } from "react";

import { AutoSizer, WindowScroller } from "react-virtualized";

import "./ListItemsPage.css";
import "react-virtualized/styles.css"; // only needs to be imported once
import ListItemsInfiniteLoader from "./ListItemsInfiniteLoader";

const LOAD_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  LOAD_SUCCESS: "load_success",
  LOAD_ERROR: "load_error",
};

export default function ListItemsPage({ customElement }) {
  const [loadStatus, setLoadStatus] = useState(LOAD_STATUS.IDLE);

  console.log(customElement);
  return (
    <WindowScroller scrollElement={customElement || window}>
      {({ width, height, isScrolling, registerChild, scrollTop }) => (
        <>
          <div className="filters">filters area</div>
          <div ref={registerChild}>
            <ListItemsInfiniteLoader
              height={height}
              width={width}
              isScrolling={isScrolling}
              scrollTop={scrollTop}
            />
          </div>
          {loadStatus === LOAD_STATUS.LOADING && <div>Loading...</div>}
        </>
      )}
    </WindowScroller>
  );
}
