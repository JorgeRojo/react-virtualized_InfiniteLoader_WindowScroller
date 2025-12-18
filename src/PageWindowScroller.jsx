import React from "react";

import { WindowScroller } from "react-virtualized";

import ListItemsInfiniteLoader from "./ListItemsInfiniteLoader";

import "./PageWindowScroller.css";

export default function PageWindowScroller({ layoutMainHtmlElement }) {
  console.log(layoutMainHtmlElement);
  return (
    <WindowScroller scrollElement={layoutMainHtmlElement || window}>
      {({ width, height, isScrolling, registerChild, scrollTop }) => (
        <div className="page-container">
          <div className="page-filters">filters area</div>
          <div ref={registerChild} className="page-list">
            <ListItemsInfiniteLoader
              height={height}
              width={width}
              isScrolling={isScrolling}
              scrollTop={scrollTop}
            />
          </div>
          <div className="page-bottom">FINISH!</div>
        </div>
      )}
    </WindowScroller>
  );
}
