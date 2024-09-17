import { http, HttpResponse } from 'msw'
import mockData from './mockData.json'
 
export const handlers = [
  http.get('https://api.dictionaryapi.dev/api/v2/entries/en/banana', () => {
    return HttpResponse.json({ words: mockData })
  }),
]