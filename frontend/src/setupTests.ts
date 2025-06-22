import '@testing-library/jest-dom';

// Mock do ResizeObserver que não está disponível no ambiente de teste
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock do IntersectionObserver que não está disponível no ambiente de teste
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}; 