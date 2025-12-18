import React, { useEffect } from "react";

import { WindowScroller } from "react-virtualized";

import ListItemsAutoSizer from "./ListItemsAutoSizer";

import "./PageWindowScroller.css";

export default function PageWindowScroller() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <WindowScroller scrollElement={window}>
      {({ height, isScrolling, registerChild, scrollTop }) => (
        <div className="page-container">
          <div className="page-filters">filters area</div>
          <div ref={registerChild} className="page-list">
            <ListItemsAutoSizer
              height={height}
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
