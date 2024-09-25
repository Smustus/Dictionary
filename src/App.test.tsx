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

    await userEvent.click(themeCheckbox);
    expect(themeCheckbox).not.toBeChecked();
    expect(document.body.classList.contains('dark-theme')).toBe(false);
  });
   
  it('Properly loads saved words from session storage upon mounting', async () => {
    sessionStorage.setItem('savedWords', JSON.stringify(['apple', 'banana']));
    render(<App />);
    
    expect(screen.getByText(/Apple/i)).toBeInTheDocument();
    expect(screen.getByText(/Banana/i)).toBeInTheDocument();
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
  
  it('Assess if the user can search for a word by pressing Enter, and the word being properly rendered', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/search/i);
    await userEvent.type(input, 'banana');
    await userEvent.keyboard('[Enter]');

    expect(await screen.findByText(/Meanings:/i)).toBeInTheDocument();
    expect(await screen.findByText(/noun/i)).toBeInTheDocument();
    expect(screen.getByText('The penis.')).toBeInTheDocument();
    expect(await screen.findByText(/adjective/i)).toBeInTheDocument();
    expect(screen.getByText('Curved like a banana, especially of a ball in flight.')).toBeInTheDocument(); 
  });
  
   

  it('*FULL USER FULL* Assess if the user can search for a word by pressing enter and click, the word properly being rendered and the user can add it to saved words. Then check if users can press the saved word to obtain the word definition once again. Lastly, we assess if the user may delete a saved word', async () => {
    render(<App />);
    
    //Enter search input and search
    const input = screen.getByPlaceholderText(/search/i);
    await userEvent.type(input, 'banana');
    await userEvent.keyboard('[Enter]');
    
    expect(screen.getByText(/Meanings:/i)).toBeInTheDocument();
    expect(screen.getByText(/noun/i)).toBeInTheDocument();
    expect(screen.getByText('The penis.')).toBeInTheDocument();
    expect(screen.getByText(/adjective/i)).toBeInTheDocument();
    expect(screen.getByText('Curved like a banana, especially of a ball in flight.')).toBeInTheDocument(); 
    expect(screen.getByText(/Pronunciations:/i)).toBeInTheDocument();
    const audio = await screen.findAllByRole('audio');
    expect(audio[0]).toHaveAttribute('src', 'https://api.dictionaryapi.dev/media/pronunciations/en/banana-uk.mp3');
    expect(screen.getByText(/Currently no favorite words/i)).toBeInTheDocument()

    //Save to favorites
    const saveButton = await screen.findByRole('button', { name: /Save to favorites/i});
    await userEvent.click(saveButton);

    const savedWordsList = screen.getByRole('list');
    const savedWord = within(savedWordsList).getByText(/banana/i);
    expect(savedWord).toBeInTheDocument();
    expect(screen.queryByText(/Currently no favorite words/i)).not.toBeInTheDocument()

    //Seach for another word
    await userEvent.type(input, 'charlie');
    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);
    
    expect(screen.getByText(/Meanings:/i)).toBeInTheDocument();
    expect(screen.getByText('An enemy; the Vietcong; short for Victor Charlie.')).toBeInTheDocument();
    expect(screen.queryByText('Curved like a banana, especially of a ball in flight.')).not.toBeInTheDocument(); 

    //Click the saved word to check if it properly re-renders the data
    await userEvent.click(savedWord);

    expect(screen.getByText(/Meanings:/i)).toBeInTheDocument();
    expect(screen.getByText(/noun/i)).toBeInTheDocument();
    expect(screen.getByText('The penis.')).toBeInTheDocument();
    expect(screen.getByText(/adjective/i)).toBeInTheDocument();
    expect(screen.getByText('Curved like a banana, especially of a ball in flight.')).toBeInTheDocument(); 
    expect(screen.getByText(/Pronunciations:/i)).toBeInTheDocument();
    expect(audio[0]).toHaveAttribute('src', 'https://api.dictionaryapi.dev/media/pronunciations/en/banana-uk.mp3');

    //Assess if the user can delete the saved word
    const deleteButton = screen.getByAltText('X');
    await userEvent.click(deleteButton);
    expect(screen.getByText(/Currently no favorite words/i)).toBeInTheDocument()
  });
});