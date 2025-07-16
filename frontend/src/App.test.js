import { render, screen } from '@testing-library/react';
import App from './App';

test('header is present', () => {
  render(<App />);
  const linkElement = screen.getByText(/Coffee House!/i);
  expect(linkElement).toBeInTheDocument();
});
