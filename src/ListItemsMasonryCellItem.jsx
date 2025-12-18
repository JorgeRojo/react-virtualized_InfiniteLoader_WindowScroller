import React from "react";

const ListItemsMasonryCellItem = React.forwardRef(function ListItemsMasonryCellItem(
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
  );
});

export default ListItemsMasonryCellItem;
