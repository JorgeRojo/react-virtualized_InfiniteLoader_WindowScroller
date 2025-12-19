import React from "react";
import { useListItemRenderOptions } from "./ListItemRenderOptionsContext";

export default function ListItemRenderOptions() {
  const { options, toggleOption } = useListItemRenderOptions();

  return (
    <div>
      <h3>Configure product visible items:</h3>
      {Object.entries(options).map(([key, visible]) => (
        <>
          <label key={key}>
            <input
              type="checkbox"
              checked={visible}
              onChange={() => toggleOption(key)}
            />
            {key}
          </label>
          <br />
        </>
      ))}
    </div>
  );
}
