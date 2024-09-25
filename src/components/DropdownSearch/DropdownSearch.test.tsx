import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropdownSearch from './DropdownSearch';
import { beforeEach, describe, expect, it, vi } from 'vitest';


describe('DropdownSearch component', () => {
  const mockSetActiveWord = vi.fn();

  beforeEach(() => {
    render(<DropdownSearch setActiveWord={mockSetActiveWord} />);
  })

  it('Properly render input and search button', () => {
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('Displays suggestions when API returns several options', async () => {
    const input = screen.getByPlaceholderText(/search/i);
    await userEvent.type(input, 'he');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);

    const list = await screen.findByRole('list');
    expect(list).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('Does not display options when API only returns one option', async () => {
    const input = screen.getByPlaceholderText(/search/i);
    await userEvent.type(input, 'banana');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);

    const list = screen.queryByRole('list');
    expect(list).not.toBeInTheDocument()
  });

  it('Returns the message from the API when a user search for a word without a definition', async () => {
    const input = screen.getByPlaceholderText(/search/i);
    await userEvent.type(input, 'ble');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(await screen.findByText(/Sorry pal, we couldn't find definitions for the word you were looking for./i)).toBeInTheDocument()
  });
});