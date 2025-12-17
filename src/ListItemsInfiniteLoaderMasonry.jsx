import React, { useRef, useState, useCallback, forwardRef } from "react";
import fetchProducts from "./fetchProducts";

import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  InfiniteLoader,
  Masonry,
} from "react-virtualized";

import "react-virtualized/styles.css";
import "./ListItemsPage.css";

const initialRowCount = 5000;

const columnWidth = 200;
const defaultHeight = 300;
const spacer = 16;
const defaultWidth = columnWidth;

const cache = new CellMeasurerCache({
  defaultHeight,
  defaultWidth,
  fixedWidth: true,
});

const cellPositioner = createMasonryCellPositioner({
  cellMeasurerCache: cache,
  columnCount: 2, //TODO: calculate from available space
  columnWidth,
  spacer,
});

const getItemKey = (index) => `_${index}_`;

export default function ListItemsInfiniteLoaderMasonry({
  height,
  width,
  isScrolling,
  scrollTop,
}) {
  const [numRows, setNumRows] = useState(initialRowCount);
  const listItemsMapRef = useRef(new Map());

  function getDataItem({ index }) {
    return listItemsMapRef.current.get(getItemKey(index));
  }

  function isRowLoaded({ index }) {
    return getDataItem({ index }) != null;
  }

  const loadMoreRows = useCallback(async ({ startIndex, stopIndex }) => {
    const pageSize = stopIndex - startIndex || 1;
    const currentPage = Math.round(startIndex / pageSize);

    console.log({ stopIndex, startIndex, currentPage, pageSize });

    if (pageSize <= 0) {
      return;
    }

    try {
      const { dataItems: newDataItems, total } = await fetchProducts(
        currentPage,
        pageSize
      );

      if (total && !isNaN(total) && Array.isArray(newDataItems)) {
        Array.from({ length: total }, () => null).forEach((_, index) => {
          if (!listItemsMapRef.current.has(getItemKey(index))) {
            listItemsMapRef.current.set(getItemKey(index), null);
          }

          if (index >= startIndex) {
            listItemsMapRef.current.set(
              getItemKey(index),
              newDataItems[index - startIndex]
            );
          }
        });

        setNumRows(total);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  function cellRenderer({ index, key, parent, style }) {
    const dataItem = getDataItem({ index });

    return (
      <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
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

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={numRows}
    >
      {({ onRowsRendered, registerChild }) => (
        <Masonry
          onCellsRendered={onRowsRendered}
          ref={registerChild}
          cellCount={numRows}
          cellMeasurerCache={cache}
          cellPositioner={cellPositioner}
          cellRenderer={cellRenderer}
          autoHeight
          height={height}
          isScrolling={isScrolling}
          scrollTop={scrollTop}
          width={width - spacer * 2}
        />
      )}
    </InfiniteLoader>
  );
}
