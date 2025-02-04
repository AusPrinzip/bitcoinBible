import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const wordlist = fs.readFileSync(__dirname + '/words.txt', 'utf8').split('\n').map(word => word.trim());

// Create a set for fast word lookup
const wordSet = new Set(wordlist);

// Function to extract words from a file
function extractWordsFromText(text) {
  
  // Replace dots and other punctuation marks with spaces
  const cleanedContent = text.replace(/[.,!?;(){}[\]"':]/g, ' ');

  // Split the content into words and remove non-alphabetical characters
  const words = cleanedContent.split(/\s+/).map(word => word.trim().toLowerCase()).filter(Boolean);
  
  return words;
}

// Function to check if there are 12 or more consecutive BIP39 valid words
export function checkForConsecutiveBIP39Words(text) {
  const words = extractWordsFromText(text);
  
  // Initialize a counter for consecutive valid BIP39 words
  let consecutiveValidWords = 0;
  let validWordSequence = [];

  for (const word of words) {
    if (wordSet.has(word)) {
      // If the word is valid, increment the counter and add the word to the sequence
      consecutiveValidWords++;
      // console.log("consecutiveValidWords", consecutiveValidWords)
      // console.log("word", word)
      validWordSequence.push(word);
      console.log(validWordSequence)
      // If we have found a sequence of 12 or more words, return it
      if (consecutiveValidWords >= 12) {
        console.log(`Found a sequence of 12 valid BIP39 words in text: ${text}`);
        console.log('Valid sequence:', validWordSequence.join(' '));
        return validWordSequence.join(' ');  // Found a valid sequence of at least 12 words
      }
    } else {
      // If the word is not valid, reset the counter and sequence
      consecutiveValidWords = 0;
      validWordSequence = [];
    }
  }

  // console.log('No valid sequence of 12 or more consecutive BIP39 words found.');
  return false;
}

export function checkForBIP39Words(text) {
  const words = extractWordsFromText(text);
  
  // Initialize a counter for valid BIP39 words
  let validWordCount = 0;
  const validWords = [];

  // Iterate through the extracted words
  for (const word of words) {
    if (wordSet.has(word)) {
      // If the word is valid, increment the counter and add it to the validWords list
      validWordCount++;
      validWords.push(word);
      // console.log(validWords)
      // console.log(validWords.length)
      // If we have found 12 or more valid BIP39 words, return the sequence
      if (validWordCount >= 12) {
        // console.log(`Found ${validWordCount} valid BIP39 words in text: ${text}`);
        // console.log('Valid words:', validWords.join(' '));
        return validWords.join(' ');  // Found at least 12 valid BIP39 words
      }
    }
  }

  // If less than 12 valid words are found
  // console.log('No valid sequence of 12 or more BIP39 words found.');
  return false;
}