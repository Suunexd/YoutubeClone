import { render, screen } from '@testing-library/react';
import channel_page from './channel_page';

test('renders learn react link', () => {
  render(<channel_page/>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
