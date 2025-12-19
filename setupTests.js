import '@testing-library/jest-dom';

// Mock window.scrollTo for jsdom
window.scrollTo = jest.fn();
