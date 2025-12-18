import React, { useCallback } from "react";

import { AutoSizer } from "react-virtualized";

import ListItemsInfiniteLoader from "./ListItemsInfiniteLoader";

export default function ListItemsAutoSizer({ height, isScrolling, scrollTop }) {
  const handleOnResize = useCallback(() => {}, []);

  return (
    <AutoSizer
      disableHeight
      height={height}
      onResize={handleOnResize}
      scrollTop={scrollTop}
    >
      {({ width }) => (
        <ListItemsInfiniteLoader
          handleOnResize={handleOnResize}
          height={height}
          isScrolling={isScrolling}
          scrollTop={scrollTop}
          scrollAreaWidth={width}
        />
      )}
    </AutoSizer>
  );
}
