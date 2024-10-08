import { useEffect, useState } from 'react';
import './App.css'
import DropdownSearch from './components/DropdownSearch/DropdownSearch'
import DictionaryCard from './components/DictionaryCard/DictionaryCard';
import SavedWords from './components/SavedWords/SavedWords';

function App() {
  // State to manage the currently active word's definition.
  const [activeWord, setActiveWord] = useState<WordDefinition | null>(null);
  // State to manage the list of saved words.
  const [savedWords, setSavedWords] = useState<string[]>([]);
  //State to manage the light theme
  const [theme, setTheme] = useState('light');

  //UseEffect to initialize the component with data from sessionStorage and localStorage. Initiates or loads the saved words from sessionStorage so the list persists across page reloads. Loads the saved theme (dark/light) from localStorage and applies it.
  useEffect(() => {
    const storedSavedWords: string[] = JSON.parse(sessionStorage.getItem('savedWords') || "[]");
    setSavedWords(storedSavedWords)

    //Saves the theme in localstorage so the user dont need to switch everytime they enter the page
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.classList.toggle('dark-theme', savedTheme === 'dark');
      setTheme(savedTheme)
    }
  }, []);

  //Function to handle when the user toggles between dark and light theme and save the current choice in localstorage
  const toggleTheme = (e: React.MouseEvent<HTMLInputElement>) => {
    const newTheme = (e.target as HTMLInputElement).checked ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme)
  };

  return (
    <>
      <header>
        <h1>Dictionary</h1>
        <section className='header_themeToggle'>
          <p>Theme</p>
          <label className="switch">
            <input type="checkbox" defaultChecked={theme === 'dark'} onClick={(e) => toggleTheme(e)} />
            <span className="slider round"></span>
          </label>
        </section>
        <DropdownSearch setActiveWord={setActiveWord} />
      </header>

      <main>
        <DictionaryCard activeWord={activeWord} setSavedWords={setSavedWords} />
        <SavedWords setActiveWord={setActiveWord} setSavedWords={setSavedWords} savedWords={savedWords} />
      </main>
      
    </>
  )
}

export default App
