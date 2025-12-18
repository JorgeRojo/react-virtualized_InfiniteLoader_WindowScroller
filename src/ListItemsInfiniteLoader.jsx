import React, { useRef, useState, useCallback, forwardRef } from "react";
import fetchProducts from "./fetchProducts";

import { InfiniteLoader } from "react-virtualized";
import ListItemsMasonry from "./ListItemsMasonry";

const INITIAL_LIST_ITEMS_COUNT = 5000;

const getItemKey = (index) => `_${index}_`;

export default function ListItemsInfiniteLoader({
  height,
  isScrolling,
  scrollTop,
  width,
}) {
  const [listItemsCount, setListItemsCount] = useState(
    INITIAL_LIST_ITEMS_COUNT
  );
  const listItemsMapRef = useRef(new Map());

  const getDataItemByIndex = useCallback(({ index }) => {
    return listItemsMapRef.current.get(getItemKey(index));
  }, []);

  function isRowLoaded({ index }) {
    return getDataItemByIndex({ index }) != null;
  }

  const loadMoreRows = useCallback(async ({ startIndex, stopIndex }) => {
    const pageSize = stopIndex - startIndex || 1;
    const currentPage = Math.round(startIndex / pageSize);

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
          width={width}
        />
      )}
    </InfiniteLoader>
  );
}
