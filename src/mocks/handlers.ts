import { http, HttpResponse } from 'msw'
import mockData from './mockData.json'
 
export const handlers = [
  http.get('https://api.dictionaryapi.dev/api/v2/entries/en/:word', (req) => {    
    const { word } = req.params;

    if(word === 'banana') return HttpResponse.json(mockData, { status: 200 })

    if(word === 'ble') return HttpResponse.json({ 
        title: "No Definitions Found", 
        message: "Sorry pal, we couldn't find definitions for the word you were looking for.", 
        resolution: "You can try the search again at later time or head to the web instead." 
      }, { status: 200 }
    )

    if(word === 'he') return HttpResponse.json([
      {
        word: 'he',
      },
      {
        word: 'he',
      },
      {
        word: 'he',
      }
    ], { status: 200 })
  }),
]