import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mn from 'electrum-mnemonic'
// import bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib'

bitcoin.initEccLib(ecc)
const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

const __dirname = dirname(fileURLToPath(import.meta.url));
const wordlist = JSON.parse(fs.readFileSync(__dirname + '/words.json', 'utf8'));
// console.log(wordlist)
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
export function checkForConsecutiveElectrumWords(text) {
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

export function checkForElectrumWords(text) {
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

export function mnemonicToPubs(mnemonic) {
  const seed = mn.mnemonicToSeedSync(mnemonic, { skipCheck: true })
  // Derive the HD wallet key using BIP32 (m/44'/0'/0')
  const root = bip32.fromSeed(seed);
  const purposeFields = ['44', '84']

  const pubs = [];
  // const privs = [];
  for (let i = 0; i < purposeFields.length; i++) {
    const purposeField = purposeFields[i]
    for (let j = 0; j < 3; j++) {
      const child = root.derivePath(`m/${purposeField}'/0'/0'/0/${j}`);
      const privateKey = Buffer.from(child.privateKey)
      // privs.push(privateKey.toString("hex"))
      switch (purposeField) {
        case '44': {
          let keyPair = ECPair.fromPrivateKey(privateKey, { network: bitcoin.networks.mainnet, compressed: true })
          let payment = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
          pubs.push(payment.address)

          // P2PKH uncompressed (starts with 1)
          keyPair = ECPair.fromPrivateKey(privateKey, { network: bitcoin.networks.mainnet, compressed: false })
          payment = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
          pubs.push(payment.address)
          break;
        }
        case '84': {
          // SegWit (starts with bc1q)
          let keyPair = ECPair.fromPrivateKey(privateKey, { network: bitcoin.networks.mainnet})
          let payment = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey});
          pubs.push(payment.address)
          break;
        }
      }
    }
  }
  // console.log(pubs)
  // console.log(privs)
  return pubs;
}
