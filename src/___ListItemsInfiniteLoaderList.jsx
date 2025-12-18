import React, { useRef, useState, useCallback } from "react";
import fetchProducts from "./fetchProducts";

import { WindowScroller, InfiniteLoader, List } from "react-virtualized";

import "react-virtualized/styles.css";
import "./ListItemsPage.css";

const initialRowCount = 5000;
const getItemKey = (index) => `_${index}_`;

export default function ListItemsInfiniteLoaderList({
  height,
  width,
  isScrolling,
  scrollTop,
}) {
  const [rowCount, setRowCount] = useState(initialRowCount);
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

        setRowCount(total);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  function rowRenderer({ key, index, style }) {
    const dataItem = getDataItem({ index });

    if (!dataItem)
      return (
        <div className="list-item" html-id={index} key={key} style={style}>
          {index} - {key} - Loading...
        </div>
      );

    return (
      <div className="list-item" html-id={index} key={key} style={style}>
        <p className="list-item-title">
          {index} - {key} - {dataItem.id} - {dataItem.title}
        </p>
        {/*
          <img className="list-item-thumbnail" src={dataItem.thumbnail} alt={title} />
          <p className="list-item-description">{dataItem.description}</p> 
        */}
      </div>
    );
  }

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={rowCount}
    >
      {({ onRowsRendered, registerChild }) => (
        <List
          autoHeight
          height={height}
          isScrolling={isScrolling}
          scrollTop={scrollTop}
          autoWidth
          width={width}
          onRowsRendered={onRowsRendered}
          ref={registerChild}
          rowCount={rowCount}
          rowHeight={60}
          rowRenderer={rowRenderer}
        />
      )}
    </InfiniteLoader>
  );
}
