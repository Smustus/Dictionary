import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { beforeEach, describe, expect, it } from 'vitest';

describe('App Component', () => {

  beforeEach(() => {
    sessionStorage.clear();
  });

  it('App renders properly with default theme(light) and no saved words', () => {
    render(<App />);
    const header = screen.getByRole('heading', { name: /Dictionary/i });
    expect(header).toBeInTheDocument();

    const themeCheckbox = screen.getByRole('checkbox');
    expect(themeCheckbox).not.toBeChecked();

    const noSavedWordsMessage = screen.getByText(/Currently no favorite words/i);
    expect(noSavedWordsMessage).toBeInTheDocument();
  });

  it('User is able to toggle between light and dark theme', async () => {
    render(<App />);
    const themeCheckbox = screen.getByRole('checkbox');

    expect(themeCheckbox).not.toBeChecked();
    expect(document.body.classList.contains('dark-theme')).toBe(false);

    await userEvent.click(themeCheckbox);
    expect(themeCheckbox).toBeChecked();
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    await userEvent.click(themeCheckbox);
    expect(themeCheckbox).not.toBeChecked();
    expect(document.body.classList.contains('dark-theme')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });
   
  it('Properly loads saved words from session storage upon mounting', async () => {
    sessionStorage.setItem('savedWords', JSON.stringify(['apple', 'banana']));
    render(<App />);
    
    expect(screen.getByText(/Apple/i)).toBeInTheDocument();
    expect(screen.getByText(/Banana/i)).toBeInTheDocument();
  }); 
  
  it('Search for a word, add the word to saved words, is displayed and persists in session storage', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/search/i);
    await userEvent.type(input, 'banana');

    const searchButton = screen.getByRole('button', { name: /Search/i });
    await userEvent.click(searchButton);

    const saveButton = await screen.findByRole('button', { name: /Save to favorites/i});
    await userEvent.click(saveButton);

    const savedWordsList = screen.getByRole('list');
    const savedWord = within(savedWordsList).getByText(/banana/i);
    expect(savedWord).toBeInTheDocument();
  
    expect(JSON.parse(sessionStorage.getItem('savedWords')!)).toEqual(['banana']);
  });
  
  it('Assess if the user can properly remove saved words and that the session storage is updated', async () => {
    sessionStorage.setItem('savedWords', JSON.stringify(['apple']));
    render(<App />);

    const savedWord = screen.getByText('Apple');
    expect(savedWord).toBeInTheDocument();

    const deleteButton = screen.getByAltText('X');
    await userEvent.click(deleteButton);

    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    expect(sessionStorage.getItem('savedWords')).toBe('[]');
  });
});