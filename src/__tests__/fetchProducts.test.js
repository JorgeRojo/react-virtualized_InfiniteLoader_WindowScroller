import axios from 'axios';
import fetchProducts from '../fetchProducts';

jest.mock('axios');

describe('fetchProducts', () => {
  it('fetches products successfully', async () => {
    const mockData = {
      products: [{ id: 1, title: 'Product 1' }],
      total: 100,
    };
    axios.get.mockResolvedValue({ data: mockData });

    const result = await fetchProducts(0, 10);

    expect(axios.get).toHaveBeenCalledWith(
      'https://dummyjson.com/products',
      { params: { skip: 0, limit: 10 } }
    );
    expect(result).toEqual({
      dataItems: mockData.products,
      total: mockData.total,
    });
  });

  it('returns empty array on error', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    const result = await fetchProducts(0, 10);

    expect(result).toEqual([]);
  });
});
