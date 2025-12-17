import axios from "axios";

const fetchProducts = async (page = 0, size = 1) => {
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
