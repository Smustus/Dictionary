import React from 'react'
import './SavedWords.css';
import { fetchWord } from '../../utilities/fetch';
import trashcan from '../../assets/trashcan.svg';
import { firstLetterUC } from '../../utilities/formatting';

interface SavedWordsProps {
  setActiveWord: React.Dispatch<React.SetStateAction<WordDefinition | null>>;
  setSavedWords: React.Dispatch<React.SetStateAction<string[]>>;
  savedWords: string[];
};

const SavedWords: React.FC<SavedWordsProps> = ({setActiveWord, setSavedWords, savedWords}) => {

  //Function to handle when a user click on a currently favorites word, and it fetches the full word object from the API
  const handleOnClick = async (word: string) => {
    const wordData = await fetchWord(word)
    console.log(wordData);
    setActiveWord(wordData[0])
  }

  //Handles when a user wants to a delete a favorited word, filters through the array and updated the state and sessionStorage
  const handleDelete = (deletedWord: string) => {
    const newSavedWords = savedWords.filter((word) => {
      return word !== deletedWord;
    });
    setSavedWords(newSavedWords);
    sessionStorage.setItem('savedWords', JSON.stringify(newSavedWords));
  }

  return (
    savedWords.length > 0 ? (
    <section className='savedWordsContainer'>
        <h3>Favorites</h3>
        
        <ul className='savedWordsContainer_list'>
        {
          savedWords.map((word, index) => {
            return (
              <article className='list_card' key={`word-${index}`}>
                <li className='card_savedWord' onClick={() => handleOnClick(word)}>{firstLetterUC(word)}</li>
                <button className='card_savedWordDeleteBtn' onClick={() => handleDelete(word)}>
                  <figure className="card_svg">
                    <img src={trashcan} alt="X" />
                  </figure>
                </button>
              </article>
            )
          })
        }
        </ul>
    </section>
    ) :
    (
      <section className='savedWordsContainer'>
          <h3>Favorites</h3>
          <p>Currently no favorite words</p>
      </section>
      )

  )
}

export default SavedWords