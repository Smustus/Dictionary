import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, MockedFunction } from 'vitest';
import userEvent from '@testing-library/user-event';
import SavedWords from './SavedWords';
import { fetchWord } from '../../utilities/fetch';

describe('SavedWords Component', () => {
  vi.mock('../../utilities/fetch');
  const setActiveWord = vi.fn();
  const setSavedWords = vi.fn();
  const fetchWordMock = fetchWord as MockedFunction<typeof fetchWord>;

  it('Display "Currently no favorite words" when there are no saved words', () => {
    render(<SavedWords setActiveWord={setActiveWord} setSavedWords={setSavedWords} savedWords={[]} />);
    expect(screen.getByText(/favorites/i)).toBeInTheDocument();
    expect(screen.getByText(/currently no favorite words/i)).toBeInTheDocument();
  });

   it('Should properly render saved words', () => {
    render(<SavedWords setActiveWord={setActiveWord} setSavedWords={setSavedWords} savedWords={['apple', 'banana']} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('Asses if the component allows for the user to fetch API data from a favourited(saved) word', async () => {
    const savedWords = ['chihuahua'];
    const mockWordData = [{ word: 'chihuahua'}];
    fetchWordMock.mockResolvedValue(mockWordData);

    render(<SavedWords setActiveWord={setActiveWord} setSavedWords={setSavedWords} savedWords={savedWords} />);

    const wordItem = screen.getByText(/chihuahua/i);
    await userEvent.click(wordItem);

    expect(fetchWord).toHaveBeenCalledWith('chihuahua');
    expect(setActiveWord).toHaveBeenCalledWith(mockWordData[0]);
  }); 

  it('Assess if the user can remove a word from saved words when clicking the delete button', async () => { 
    sessionStorage.clear();
    let savedWords = ['apple', 'banana']
    const { unmount } = render(<SavedWords setActiveWord={setActiveWord} setSavedWords={setSavedWords} savedWords={savedWords} />);

    let listItem = screen.getAllByRole('listitem');
    expect(listItem[0]).toHaveTextContent('Apple');
    expect(listItem[1]).toHaveTextContent('Banana');

    //Apple delete button
    const deleteButton = screen.getAllByRole('button');
    await userEvent.click(deleteButton[0]);

    expect(setSavedWords).toHaveBeenCalledWith(['banana']);
    
    unmount()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    savedWords = JSON.parse(sessionStorage.getItem('savedWords')!);
    render(<SavedWords setActiveWord={setActiveWord} setSavedWords={setSavedWords} savedWords={savedWords} />);
    
    listItem = screen.getAllByRole('listitem');
    expect(listItem).toHaveLength(1);
    expect(listItem[0]).toHaveTextContent('Banana');
  });
});