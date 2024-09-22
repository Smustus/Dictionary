/* eslint-disable @typescript-eslint/consistent-type-definitions */
type WordDefinition = {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license: License;
  sourceUrls: string[];
};

type Phonetic = {
  text: string;
  audio: string;
  sourceUrl: string;
  license?: License;
};

type Meaning = {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
};

type Definition = {
  definition: string;
  synonyms: string[];
  antonyms: string[];
};

type License = {
  name: string;
  url: string;
};