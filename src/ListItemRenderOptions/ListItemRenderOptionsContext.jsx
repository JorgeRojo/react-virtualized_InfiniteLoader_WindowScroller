import React, { createContext, useContext, useState } from "react";

export const ITEM_HEIGHTS = {
  title: { height: 32, paddingTop: 16, paddingBottom: 16 },
  thumbnail: { height: 8 * 22, paddingTop: 0, paddingBottom: 0 },
  status: { height: 12, paddingTop: 8, paddingBottom: 8 },
  brand: { height: 12, paddingTop: 8, paddingBottom: 16 },
  description: { height: 8 * 12, paddingTop: 8, paddingBottom: 8 },
};

const BASE_HEIGHT = 48;

const ListItemRenderOptionsContext = createContext();

export function ListItemRenderOptionsProvider({ children }) {
  const [options, setOptions] = useState({
    title: true,
    thumbnail: true,
    status: true,
    brand: true,
    description: true,
  });

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateHeight = () => {
    return (
      BASE_HEIGHT +
      Object.entries(options).reduce((acc, [key, visible]) => {
        if (!visible) return acc;
        const { height, paddingTop, paddingBottom } = ITEM_HEIGHTS[key];
        return acc + height + paddingTop + paddingBottom;
      }, 0)
    );
  };

  return (
    <ListItemRenderOptionsContext.Provider
      value={{ options, toggleOption, height: calculateHeight() }}
    >
      {children}
    </ListItemRenderOptionsContext.Provider>
  );
}

export function useListItemRenderOptions() {
  const context = useContext(ListItemRenderOptionsContext);
  if (!context) {
    throw new Error(
      "useListItemRenderOptions must be used within ListItemRenderOptionsProvider"
    );
  }
  return context;
}
