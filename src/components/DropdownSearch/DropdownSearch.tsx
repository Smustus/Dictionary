import React, { useEffect, useRef, useState } from 'react'
import './DropdownSearch.css';
import { fetchWord } from '../../utilities/fetch';
import { letterValidation } from '../../utilities/validation';
import Input from '../Input/Input';
import glas from '../../assets/magnifyingGlassWhite.svg';

interface DropdownSearchProps {
  setActiveWord: React.Dispatch<React.SetStateAction<WordDefinition | null>>;
};

const DropdownSearch: React.FC<DropdownSearchProps> = ({setActiveWord}) => {
  //State to store the list of suggestions based on user searchinput
  const [suggestions, setSuggestions] = useState<string[]>([]);
  //Reference to the dropdown list, used to detect clicks outside of the dropdown
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    console.log(suggestions);
  }, [suggestions]);

   //Adds event listener to detect clicks outside of the dropdown to close the suggestions and when the components unmounts its removed
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //Handles clicks outside the suggestions dropdown. If a user clicks outside the dropdown, the suggestions list will close.
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setSuggestions([]);
    }
  };

  //Function to handle user search input. If the input value is more than 1 character, it fetches suggestions from the API. Otherwise, it clears the suggestions list.
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.length > 1) { 
      const results = await fetchWord(value);
      console.log(results);
      if(results){
        setSuggestions(results.map((result: WordDefinition) => result.word));
      }
    } else {
      setSuggestions([]);
    }
  };

  //When a user clicks on a suggestion. It fetches the full word object from the API
  const handleSuggestionClick = async (suggestion: string) => {
    console.log(suggestion);
    const word = await fetchWord(suggestion);
    setActiveWord(word[0]);
    setSuggestions([]);
  };

  return (
    <div className='searchContainer'>
      <Input type='text' id={'searchFrom'} name={'searchFrom'} placeholder='Search' onChange={handleInputChange} validate={letterValidation} img={glas}>
        {suggestions.length > 0 && (
        <ul className="suggestions-dropdown" ref={dropdownRef}>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
        )}
      </Input>
      
    </div>
  )
}

export default DropdownSearch