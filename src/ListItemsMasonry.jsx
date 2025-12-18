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

  const cellMeasurerCacheRef = useRef(
    new CellMeasurerCache({
      defaultHeight: DEFAULT_ITEM_HEIGHT,
      defaultWidth: DEFAULT_ITEM_WIDTH,
      fixedWidth: true,
    })
  );

  function cellRenderer({ index, key, parent, style }) {
    const dataItem = getDataItemByIndex({ index });

    return (
      <CellMeasurer
        cache={cellMeasurerCacheRef.current}
        index={index}
        key={key}
        parent={parent}
      >
        <div className="list-item" style={style}>
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

  const getCellPositioner = useCallback((availableWidth) => {
    const columnCount = Math.floor(
      availableWidth / (ITEM_WIDTH + GRID_SPACER * 2)
    );

    return createMasonryCellPositioner({
      cellMeasurerCache: cellMeasurerCacheRef.current,
      columnCount,
      columnWidth: ITEM_WIDTH,
      spacer: GRID_SPACER,
    });
  }, []);

  const cellPositionerRef = useRef(getCellPositioner(availableWidth));

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
      ref={registerChild}
      scrollTop={scrollTop}
      width={availableWidth}
    />
  );
}
