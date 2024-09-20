import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock localStorage and sessionStorage
beforeEach(() => {
  render(<App />);
  const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      clear: () => {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock,
  });

  localStorage.clear();
  sessionStorage.clear();
});

describe('App Component', () => {
 /*  it('App renders properly with default theme(light) and no saved words', () => {
    
    const header = screen.getByRole('heading', { name: /Dictionary/i });
    expect(header).toBeInTheDocument();

    const themeCheckbox = screen.getByRole('checkbox');
    expect(themeCheckbox).not.toBeChecked();

    const noSavedWordsMessage = screen.getByText(/Currently no favorite words/i);
    expect(noSavedWordsMessage).toBeInTheDocument();
  });

  it('User is able to toggle between light and dark theme', async () => {
    
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
  });*/
  
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