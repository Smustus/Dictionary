import { render, screen } from '@testing-library/react';
import DictionaryCard from './DictionaryCard';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import mockData from '../../mocks/mockData.json';
import userEvent from '@testing-library/user-event';

describe('DictionaryCard component', () => {
  const mockSetSavedWords = vi.fn();
  const mockActiveWord = mockData[0];

  beforeEach(() => {
    render(<DictionaryCard activeWord={mockActiveWord} setSavedWords={mockSetSavedWords} />);
  });

  it('Renders meanings segment', () => {    
    expect(screen.getByText(/Meanings/i)).toBeInTheDocument();
    expect(screen.getByText(/noun/i)).toBeInTheDocument();
    expect(screen.getByText('The penis.')).toBeInTheDocument();
    expect(screen.getByText(/adjective/i)).toBeInTheDocument();
    expect(screen.getByText('Curved like a banana, especially of a ball in flight.')).toBeInTheDocument();    
  });

  it('Renders pronunciations and audio when available', async () => {  
    expect(screen.getByText(/Pronunciations:/i)).toBeInTheDocument();
    const audio = await screen.findAllByRole('audio');
    expect(audio[0]).toHaveAttribute('src', 'https://api.dictionaryapi.dev/media/pronunciations/en/banana-uk.mp3');
  });

  it('Assert if pressing the save button adds the word to session storage. And not allowing the same word to be added twice', async () => {
    const saveButton = screen.getByRole('button', { name: /Save to favorites/i });
    expect(saveButton).toBeInTheDocument();

    await userEvent.click(saveButton);
    expect(sessionStorage.getItem('savedWords')).toBe(JSON.stringify(['banana']));
    expect(mockSetSavedWords).toHaveBeenCalledWith(['banana'])

    await userEvent.click(saveButton);
    expect(sessionStorage.getItem('savedWords')).toBe(JSON.stringify(['banana']));
  });

  it('Properly display the source link', () => {
    const sourceLink = screen.getByText('https://en.wiktionary.org/wiki/banana');
    expect(sourceLink).toBeInTheDocument();
    expect(sourceLink).toHaveAttribute('href', 'https://en.wiktionary.org/wiki/banana');
  });
});