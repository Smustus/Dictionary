import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropdownSearch from './DropdownSearch';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import mockData from '../../mocks/mockData.json';


describe('DropdownSearch component', () => {
  const mockSetActiveWord = vi.fn();

  beforeEach(() => {
    render(<DropdownSearch setActiveWord={mockSetActiveWord} />);
  })

  it('Properly render input and search button', () => {
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('Displays a dropdown with suggestions when the API returns several results', async () => {
    const input = screen.getByPlaceholderText(/search/i);
    await userEvent.type(input, 'he');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);
    expect(mockSetActiveWord).not.toHaveBeenCalled();

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
    expect(mockSetActiveWord).toHaveBeenCalledWith(mockData[0]);

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

  it('Assert if a error msg appear when the user search with an empty input field', async () => {
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toHaveValue('');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(await screen.findByText(/Please enter a word to search/i)).toBeInTheDocument()
  });
});