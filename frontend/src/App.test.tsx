import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders headline', () => {
    render(<App />);
    const headline = screen.getByText(/LLM Article Project/i);
    expect(headline).toBeInTheDocument();
  });
});
