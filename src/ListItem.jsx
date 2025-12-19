import React from "react";
import {
  useListItemRenderOptions,
  ITEM_HEIGHTS,
} from "./ListItemRenderOptions/ListItemRenderOptionsContext";

import "./ListItem.css";

const ListItemContents = ({ dataItem }) => {
  const { options } = useListItemRenderOptions();

  return (
    <>
      {options.title && (
        <p className="list-item-title" style={ITEM_HEIGHTS.title}>
          {dataItem.title}
        </p>
      )}
      {options.thumbnail && (
        <img
          className="list-item-thumbnail"
          style={ITEM_HEIGHTS.thumbnail}
          src={dataItem.thumbnail}
          alt={dataItem.title}
        />
      )}
      {options.status && (
        <p className="list-item-status" style={ITEM_HEIGHTS.status}>
          {dataItem.availabilityStatus}
        </p>
      )}
      {options.brand && (
        <p className="list-item-brand" style={ITEM_HEIGHTS.brand}>
          {dataItem.brand}
        </p>
      )}
      {options.description && (
        <p className="list-item-description" style={ITEM_HEIGHTS.description}>
          {dataItem.description}
        </p>
      )}
    </>
  );
};

const ListItemSkeleton = () => {
  return <>"Loading..."</>;
};

const ListItem = React.forwardRef(function ListItemsMasonryCellItem(
  { index, getDataItemByIndex, style, leftItemPosition },
  ref
) {
  const dataItem = getDataItemByIndex({ index });

  return (
    <div
      ref={ref}
      className="list-item"
      style={{ ...style, left: leftItemPosition }}
    >
      <p className="list-item-metadata">
        index: {index} - id: {dataItem?.id ?? "null"}
      </p>
      {dataItem ? (
        <ListItemContents dataItem={dataItem} />
      ) : (
        <ListItemSkeleton />
      )}
    </div>
  );
});

export default ListItem;
