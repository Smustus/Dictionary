//Function to validate user search input and return a custom message, currently only invalidates an empty input
export const letterValidation = (input: string) => {
  if(!input){
    return 'Please enter a word to search';
  }
  /* const letterRegex = /^[A-Za-z]+$/;
  if (!letterRegex.test(input)) {
    return 'Please use only letters';
  } */
  return null;
}