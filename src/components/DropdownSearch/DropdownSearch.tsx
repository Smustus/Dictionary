import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import './DropdownSearch.css';
import { fetchWord } from '../../utilities/fetch';
import { inputValidation } from '../../utilities/validation';
import Input from '../Input/Input';
import glas from '../../assets/magnifyingGlassWhite.svg';
import { firstLetterUC } from '../../utilities/formatting';

interface DropdownSearchProps {
  setActiveWord: React.Dispatch<SetStateAction<WordDefinition | null>>;
};

const DropdownSearch: React.FC<DropdownSearchProps> = ({setActiveWord}) => {

  //State to store the list of suggestions based on user searchinput
  const [suggestions, setSuggestions] = useState<string[]>([]);

  //Reference to the dropdown list, used to detect clicks outside of the dropdown
  const dropdownRef = useRef<HTMLUListElement>(null);

  //Reference to the form submit button, used to detect clicks outside of the dropdown
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  //State to store form data
  const [searchValue, setSearchValue] = useState<string | undefined>('');

  //State to set the potential error, currently used to display if input is missing
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(searchValue); 
  }, [searchValue]);

   //Adds event listener to detect clicks outside of the dropdown to close the suggestions and when the components unmounts its removed
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitBtnRef.current?.click();
      }
    };
    const submitBtn = submitBtnRef.current;
    if (submitBtn) {
      submitBtn.addEventListener('keypress', handleKeyPress);
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    //Cleanup when the component unmounts or re-renders.
    return () => {
      if (submitBtn) {
        submitBtn.removeEventListener('keypress', handleKeyPress);
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //Handles clicks outside the suggestions dropdown. If the dropdown is present and a user clicks outside the dropdown, the suggestions list will close.
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setSuggestions([]);
    }
  };

  //Function to handle user search input. If the input value is more than 1 character, it fetches suggestions from the API. Otherwise, it clears the suggestions list.
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {   
    setSearchValue(e.target.value)
  };

  //Handles form submission, validates the input to update the potential error msg, then calls the API with the search value. If no definition is returned display related error msg. If the API returns several options, display a list of options for the user, otherwise instantly display the search result.
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    validateInput(searchValue)
    
    if(searchValue && searchValue.length > 1) { 
      const results = await fetchWord(searchValue);
      console.log(results);
      if(results.title === "No Definitions Found"){
        setError(results.message)
        return
      }

      if(results.length > 1){
        setSuggestions(results.map((result: WordDefinition) => result.word));
      } else {
        setActiveWord(results[0]);
        setSearchValue('')
      }
    }
  }

  //When a user clicks on a suggestion. It fetches the full word object from the API
  const handleSuggestionClick = async (suggestion: string) => {
    console.log(suggestion);
    const word = await fetchWord(suggestion);
    setActiveWord(word[0]);
    setSuggestions([]);
    setSearchValue('')
  };
  
  //Perform validation
  const validateInput = (value: any) => {
    const error = inputValidation(String(value));
    console.log(error);
    
    if (setError) {
      setError(error);
    }
    if (error) {
      return;
    }
  }

  return (
    <div className='searchContainer'>
      <form onSubmit={(e) => handleFormSubmit(e)}>
        <Input type='text' id='search' name='search' placeholder='Search' value={searchValue} onChange={handleInputChange} img={glas}>
          {suggestions.length > 0 && (
          <ul className="suggestions-dropdown" ref={dropdownRef}>
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {firstLetterUC(suggestion)}
              </li>
            ))}
          </ul>
          )}
        </Input>
        {error && <p className='errorMsg' style={(error === 'Please enter a word to search') ? undefined : {color: 'red'}}>{error}</p>}
        <button className='submitBtn' type='submit' ref={submitBtnRef}>Search</button>
      </form>
    </div>
  )
}

export default DropdownSearch