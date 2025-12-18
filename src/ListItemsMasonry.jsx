import React, { useRef, useEffect, useCallback, useState } from "react";

import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from "react-virtualized";

import ListItemsMasonryCellItem from "./ListItemsMasonryCellItem";
import "./ListItemsMasonry.css";

const ITEM_WIDTH = 200;
const DEFAULT_ITEM_HEIGHT = 300;
const DEFAULT_ITEM_WIDTH = ITEM_WIDTH;
const GRID_SPACER = 24;

function getLeftItemPositionForSpaceAround({
  index,
  columnCount,
  scrollAreaWidth,
}) {
  const indexInRow = index % columnCount;
  const totalItemsWidth = columnCount * ITEM_WIDTH;
  const availableSpace = scrollAreaWidth - totalItemsWidth;

  if (columnCount === 1) {
    return availableSpace / 2;
  } else {
    const gap = availableSpace / (columnCount - 1);
    return indexInRow * (ITEM_WIDTH + gap);
  }
}

export default function ListItemsMasonry({
  cellCount,
  getDataItemByIndex,
  height,
  isScrolling,
  onCellsRendered,
  registerChild,
  scrollTop,
  scrollAreaWidth,
}) {
  const masonryRef = useRef(registerChild);
  const cellMeasurerCacheRef = useRef(
    new CellMeasurerCache({
      defaultHeight: DEFAULT_ITEM_HEIGHT,
      defaultWidth: DEFAULT_ITEM_WIDTH,
      fixedWidth: true,
      fixedHeight: true,
    })
  );

  const columnCount = Math.floor(
    (scrollAreaWidth - GRID_SPACER / 2) / (ITEM_WIDTH + GRID_SPACER / 2)
  );

  const cellPositionerRef = useRef(
    createMasonryCellPositioner({
      cellMeasurerCache: cellMeasurerCacheRef.current,
      columnCount,
      columnWidth: ITEM_WIDTH,
      spacer: GRID_SPACER,
    })
  );

  const resetMasonry = useCallback(() => {
    cellPositionerRef.current.reset({
      columnCount,
      columnWidth: ITEM_WIDTH,
      spacer: GRID_SPACER,
    });
    cellMeasurerCacheRef.current.clearAll();
    masonryRef.current.clearCellPositions();
  }, [columnCount]);

  useEffect(() => {
    resetMasonry();
  }, [scrollAreaWidth, columnCount, resetMasonry]);

  const cellRenderer = useCallback(
    ({ index, key, parent, style }) => {
      const leftItemPosition = getLeftItemPositionForSpaceAround({
        index,
        columnCount,
        scrollAreaWidth,
      });

      return (
        <CellMeasurer
          cache={cellMeasurerCacheRef.current}
          index={index}
          key={key}
          parent={parent}
        >
          {({ registerChild }) => (
            <ListItemsMasonryCellItem
              ref={registerChild}
              index={index}
              getDataItemByIndex={getDataItemByIndex}
              leftItemPosition={leftItemPosition}
              style={style}
            />
          )}
        </CellMeasurer>
      );
    },
    [columnCount, scrollAreaWidth, getDataItemByIndex]
  );

  return (
    <Masonry
      autoHeight
      cellCount={cellCount}
      cellMeasurerCache={cellMeasurerCacheRef.current}
      cellPositioner={cellPositionerRef.current}
      cellRenderer={cellRenderer}
      height={height}
      isScrolling={isScrolling}
      onCellsRendered={onCellsRendered}
      ref={masonryRef}
      scrollTop={scrollTop}
      width={scrollAreaWidth}
    />
  );
}
