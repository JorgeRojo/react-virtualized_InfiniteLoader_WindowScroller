import React, { useState } from "react";

import { WindowScroller } from "react-virtualized";

import "./ListItemsPage.css";
import "react-virtualized/styles.css";
import ListItemsInfiniteLoaderMasonry from "./ListItemsInfiniteLoaderMasonry";

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
    <div className="page">
      <WindowScroller scrollElement={customElement || window}>
        {({ width, height, isScrolling, registerChild, scrollTop }) => (
          <>
            <div className="page-filters">filters area</div>
            <div ref={registerChild}>
              <ListItemsInfiniteLoaderMasonry
                height={height}
                width={width}
                isScrolling={isScrolling}
                scrollTop={scrollTop}
              />
            </div>
            <div className="page-bottom">
              {loadStatus === LOAD_STATUS.LOADING ? "Loading..." : "FINISH!"}
            </div>
          </>
        )}
      </WindowScroller>{" "}
    </div>
  );
}
