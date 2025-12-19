import React, { useRef, useState, useCallback } from "react";
import fetchProducts, { pageSize } from "./fetchProducts";

import { InfiniteLoader } from "react-virtualized";

import ListItemsMasonry from "./ListItemsMasonry";

const getItemKey = (index) => `_${index}_`;

export default function ListItemsInfiniteLoader({
  handleOnResize,
  height,
  isScrolling,
  scrollTop,
  scrollAreaWidth,
}) {
  const [listItemsCount, setListItemsCount] = useState(pageSize);

  const listItemsMapRef = useRef({});
  const pagesLoadedRef = useRef([]);

  const getDataItemByIndex = useCallback(({ index }) => {
    return listItemsMapRef.current[getItemKey(index)];
  }, []);

  const isRowLoaded = useCallback(({ index }) => {
    return getDataItemByIndex({ index }) != null;
  }, []);

  const loadMoreRows = useCallback(async ({ startIndex, stopIndex }) => {

    const page = Math.floor(startIndex / pageSize);

    if (pagesLoadedRef.current.includes(page)) {
      return;
    }

    pagesLoadedRef.current.push(page);

    try {
      const { dataItems, total } = await fetchProducts(page, pageSize);
      if (total && !isNaN(total) && Array.isArray(dataItems)) {
        dataItems.forEach((dataItem, index) => {
          listItemsMapRef.current[getItemKey(startIndex + index)] = dataItem;
        });

        setListItemsCount(total);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={listItemsCount}
      threshold={pageSize}
      minimumBatchSize={pageSize}
    >
      {({ onRowsRendered, registerChild }) => (
        <ListItemsMasonry
          cellCount={listItemsCount}
          getDataItemByIndex={getDataItemByIndex}
          height={height}
          isScrolling={isScrolling}
          onCellsRendered={onRowsRendered}
          registerChild={registerChild}
          scrollTop={scrollTop}
          handleOnResize={handleOnResize}
          scrollAreaWidth={scrollAreaWidth}
        />
      )}
    </InfiniteLoader>
  );
}
