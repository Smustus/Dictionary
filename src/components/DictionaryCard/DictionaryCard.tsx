import React from 'react'
import './DictionaryCard.css';

interface DictionaryCardProps {
  activeWord: WordDefinition | null;
  setSavedWords: React.Dispatch<React.SetStateAction<string[]>>;
};

const DictionaryCard: React.FC<DictionaryCardProps> = ({activeWord, setSavedWords}) => {
  console.log(activeWord);

  //function to save a word favorite unless its already present in the list
  const handleSaveWord = (word: string) => {
    const savedWords: string[] = JSON.parse(sessionStorage.getItem('savedWords') || '[]');
  
    if (!savedWords.includes(word)) {
      const newSavedWords = [...savedWords, word]
      sessionStorage.setItem('savedWords', JSON.stringify(newSavedWords));
      setSavedWords(newSavedWords);
    }
  };
  
  //if no active word is passed return nothing
  if (!activeWord) {
    return
  }

  return (
    <article className="dictionaryCard">
      <section className='dictionaryCard_titleNSaveBtn'>
        <h2>{`Word: ${activeWord.word}`}</h2>
        <button onClick={() => handleSaveWord(activeWord.word)}>Save to favorites</button>
      </section>

      <section className='dictionaryCard_meaning'>
        <h4>Meanings:</h4>
        <hr />
        {activeWord.meanings.map((meaning, index) => (
          <div key={index}>
            <h3>{meaning.partOfSpeech}</h3>
            {meaning.definitions.map((definition, defIndex) => (
              <p key={defIndex}>{definition.definition}</p>
            ))}
          </div>
        ))}
        <hr />
      </section>

      <section className='dictionaryCard_pronun'>
        <h4>Pronunciations:</h4>
        {activeWord.phonetics.map((phonetic, index) => (
          <div className='dictionaryCard_audioContainer' key={index}>
            {phonetic.audio.length > 0 ?
            <div>
              <audio key={phonetic.audio} controls>
                <source src={phonetic.audio} type="audio/mpeg" />
                Audio element not supported
              </audio>
            </div> : 
            <p key={phonetic.text}>{phonetic.text}</p>
            }
          </div>
        ))}
        
      </section>
      <p className='dictionaryCard_source'>Source: <a href={activeWord.sourceUrls[0]}>{activeWord.sourceUrls[0]}</a></p>
    </article>
  )
}

export default DictionaryCard