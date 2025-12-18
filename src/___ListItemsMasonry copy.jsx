import React, { useRef, useState, useCallback, forwardRef } from "react";
import fetchProducts from "./fetchProducts";

import { InfiniteLoader } from "react-virtualized";

const initialCelsCount = 5000;

const getItemKey = (index) => `_${index}_`;

export default function ListItemsInfiniteLoaderMasonry({
  height,
  width,
  isScrolling,
  scrollTop,
}) {
  const [numRows, setNumRows] = useState(initialCelsCount);
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

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={numRows}
    >
      {({ onRowsRendered, registerChild }) => (
        <ListItemsMasonry
          cellCount={numRows}
          height={height}
          isScrolling={isScrolling}
          onCellsRendered={onRowsRendered}
          registerChild={registerChild}
          scrollTop={scrollTop}
          width={width}
          getDataItemByIndex={getDataItemByIndex}
        />
      )}
    </InfiniteLoader>
  );
}
