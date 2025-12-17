import axios from "axios";

const fetchProducts = async (page = 0, size = 25) => {
  try {
    const skip = page * size;

    const response = await axios.get("https://dummyjson.com/products", {
      params: {
        limit: size,
        skip: skip,
      },
    });

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    return response.data.products;
  } catch (error) {
    return [];
  }
};

export default fetchProducts;
