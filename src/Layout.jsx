import React from "react";
import PageWindowScroller from "./PageWindowScroller";
import { ListItemRenderOptionsProvider } from "./ListItemRenderOptions/ListItemRenderOptionsContext";

import "./Layout.css";
import ListItemRenderOptions from "./ListItemRenderOptions/ListItemRenderOptions";

export default function Layout() {
  return (
    <ListItemRenderOptionsProvider>
      <div className="layout-container">
        <header className="layout-header">Header</header>
        <nav className="layout-menu">
          <ListItemRenderOptions />
        </nav>
        <main className="layout-main">
          <PageWindowScroller />
        </main>
        <footer className="layout-footer">Footer</footer>
      </div>
    </ListItemRenderOptionsProvider>
  );
}
