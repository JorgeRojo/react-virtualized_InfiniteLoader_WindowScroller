import React, { useRef, useState, useEffect, useCallback } from "react";

import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from "react-virtualized";

import "./ListItemsMasonry.css";

const ITEM_WIDTH = 200;
const DEFAULT_ITEM_HEIGHT = 300;
const DEFAULT_ITEM_WIDTH = ITEM_WIDTH;
const GRID_SPACER = 24;

function getLeftItemPositionForSpaceAround({index, columnCount, availableWidth}) {
  const indexInRow = index % columnCount; 
  const totalItemsWidth = columnCount * ITEM_WIDTH;
  const availableSpace = availableWidth - totalItemsWidth;
 
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
  width,
}) {
  const availableWidth = width - GRID_SPACER * 2;

  const masonryRef = useRef(registerChild);
  const cellMeasurerCacheRef = useRef(
    new CellMeasurerCache({
      defaultHeight: DEFAULT_ITEM_HEIGHT,
      defaultWidth: DEFAULT_ITEM_WIDTH,
      fixedWidth: true,
    })
  );

  const columnCount = Math.floor(
    (availableWidth - GRID_SPACER / 2) / (ITEM_WIDTH + GRID_SPACER / 2)
  );

  const cellPositionerRef = useRef(
    createMasonryCellPositioner({
      cellMeasurerCache: cellMeasurerCacheRef.current,
      columnCount,
      columnWidth: ITEM_WIDTH,
      spacer: GRID_SPACER,
    })
  );

  useEffect(() => {
    cellPositionerRef.current.reset({
      columnCount,
      columnWidth: ITEM_WIDTH,
      spacer: GRID_SPACER,
    });
    cellMeasurerCacheRef.current.clearAll();
    masonryRef.current.clearCellPositions();
  }, [availableWidth, columnCount]);




  function cellRenderer({ index, key, parent, style }) {
    const leftItemPosition = getLeftItemPositionForSpaceAround({index, columnCount, availableWidth});
    const dataItem = getDataItemByIndex({ index });

    return (
      <CellMeasurer
        cache={cellMeasurerCacheRef.current}
        index={index}
        key={key}
        parent={parent}
      >
        <div className="list-item" style={{ ...style, left: leftItemPosition }}>
          {dataItem ? (
            <>
              <p className="list-item-title">
                {dataItem.id} - {dataItem.title}
              </p>
              <img
                className="list-item-thumbnail"
                src={dataItem.thumbnail}
                alt={dataItem.title}
              />
              <p className="list-item-description">{dataItem.description}</p>
            </>
          ) : (
            "Loading..."
          )}
        </div>
      </CellMeasurer>
    );
  }

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
      width={availableWidth}
    />
  );
}
