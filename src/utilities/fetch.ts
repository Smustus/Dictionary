const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en'

export async function fetchWord(word: string){
  try {
    const response = await fetch(`${BASE_URL}/${word}`);
    const data = await response.json();
    return data
  } catch (error) {
    console.error(`Could not retrieve API data: ${error}`);
  }
}