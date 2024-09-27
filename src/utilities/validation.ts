//Function to validate user search and return a custom message, currently only invalidates an empty input
export const inputValidation = (input: string | undefined) => {
  if(!input){
    return 'Please enter a word to search';
  }
  /* const letterRegex = /^[A-Za-z]+$/;
  if (!letterRegex.test(input)) {
    return 'Please use only letters';
  } */
  return null;
}