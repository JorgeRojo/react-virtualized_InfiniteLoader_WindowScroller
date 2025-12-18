import axios from "axios";

export const pageSize = 25;

const fetchProducts = async (page, size) => {
  try {
    const skip = page * size;

    const response = await axios.get("https://dummyjson.com/products", {
      params: {
        skip: skip,
        limit: size,
      },
    });

    return {
      dataItems: response.data.products,
      total: response.data.total,
    };
  } catch (error) {
    return [];
  }
};

export default fetchProducts;
