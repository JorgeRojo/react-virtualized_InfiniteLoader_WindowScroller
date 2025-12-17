import React, { useEffect, useState } from "react";
import fetchProducts from "./fetchProducts";

import "./ListItemsPage.css";

const getPagekey = (page = 0) => `page_${page}`;
const getPlainListItems = (itemsPerPage) => Object.values(itemsPerPage).flat();

export default function ListItemsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState({
    [getPagekey(page)]: [],
  });

  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true);
        const newProducts = await fetchProducts(page);

        if (newProducts) {
          setItemsPerPage((state) => ({
            ...state,
            [getPagekey(page)]: newProducts,
          }));
        }
      } catch (err) {
        console.error("Error en el efecto:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, [page]);

  const products = getPlainListItems(itemsPerPage);

  return (
    <>
      <div className="filters">filters area</div>
      <div className="list">
        {products.map(({ title, thumbnail, description }, index) => (
          <div className="list-item" key={index}>
            <h3 className="list-item-title">{title}</h3>
            <img className="list-item-thumbnail" src={thumbnail} alt={title} />
            <p className="list-item-description">{description}</p>
          </div>
        ))}
      </div>
      {isLoading && <div>Loading...</div>}
    </>
  );
}
