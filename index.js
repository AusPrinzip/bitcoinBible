import axios from "axios";
import { wait, alertHuman } from "./utils.js";
// import { checkForBIP39Words } from "./bip39/index.js";
import { checkForElectrumWords } from "./electrum/index.js";
import { isBitcoin, hexToPubs } from "./bitcoin/index.js"
import mn from 'electrum-mnemonic'
import crypto from "crypto";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const config = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json')))

const { books } = await axios.get(`https://bible-api.com/data/kjv`).then(res => res.data) // King James Version
// console.log(books)
async function main(bookIndex = 0, chapterIndex = 0, verseIndex = 0, chapters) {
  console.log(`Starting at ${books[bookIndex].name} chapter ${chapterIndex+1} verse ${verseIndex+1}`)
  // return console.log(books)
  for (let i = bookIndex; i < books.length; i++) {
    const { name, url: chaptersUrl } = books[i];
    
    if (!chapters) {
      try {
        console.log(`Fetching chapters`)
        console.log(chaptersUrl)
        chapters = await axios.get(chaptersUrl).then(res => res.data.chapters);
      } catch(e) {
        console.log("Failed to fetch chapter, retrying..")
        await wait(5000)
        return main(i, 0, 0)
      }
    }

    try {
      console.log(`${chapterIndex} / ${chapters.length}`)
    } catch(e) {
      console.log(chapters)
      throw new Error(e)
    }
 
    for (let j = chapterIndex; j < chapters.length; j++) {
      const { url: versesUrl } = chapters[j];
      let verses;

      try {
        console.log(`Fetching verses`)
        console.log(versesUrl)
        verses = await axios.get(versesUrl).then(res => res.data.verses)
      } catch(e) {
        console.log("Failed to fetch verses, retrying..")
        await wait(5000)
        return main(i, j, 0, chapters)
      }
 
      for (let k = verseIndex; k < verses.length; k++) {
        console.log(`${name} | ${j+1} | ${k+1}`)

        const { text } = verses[k]
        // console.log("** RAW TEX **")
        // console.log(text)

        if (config.searchForElectrumWords) {
          let match = checkForElectrumWords(text)
          
          if (config.reversedMode) match.split(" ").reverse().join(" ")

          if (match) {
            console.log("*** MATCH ***")
            console.log(match)
            for (let prefix in mn.PREFIXES) {
              try {
                mn.mnemonicToSeedSync(match, { prefix })
                console.log("BINGO")
                if (config.stopOnFindings) process.exit(0)
              } catch(e) {
                // continue
              }
            }
          }
        }

        let cleanedText = text.replace(/\n$/, "").replace(/\n/g, " ").replace(/ {2,}/g, ' ');
        // console.log("** Cleaned TEX **")
        // console.log(cleanedText)
        let reversedText = cleanedText.split('').reverse().join('')
        // console.log(reversedText)

        let finalText = '';

        if (config.reversedMode) {
          finalText = reversedText;
        } else {
          finalText = cleanedText;
        }
        console.log(finalText)
        let hex64 = crypto.createHash('sha256').update(finalText, 'utf8').digest('hex')
        console.log(hex64)

        let pubKeys;
        let _isBitcoin;


        pubKeys = hexToPubs(hex64)
        _isBitcoin = await isBitcoin(pubKeys)
        console.log(`_isBitcoin code: ${_isBitcoin}`)
        if (_isBitcoin > 0) {
          alertHuman()
          if (config.stopOnFindings) process.exit(0)
        }
          
        // Removing dots
        console.log("*** Removing dots ***")
        let cleanedText2 = cleanedText.replace(/\.$/, '').replace(/;$/, '').replace(/:$/, '').replace(/,$/, '');
        
        if (cleanedText !== cleanedText2) {
          console.log(JSON.stringify(cleanedText2))
          reversedText = cleanedText2.split('').reverse().join('')


          if (config.reversedMode) {
            finalText = reversedText;
          } else {
            finalText = cleanedText2;
          }

          hex64 = crypto.createHash('sha256').update(finalText, 'utf8').digest('hex')
          console.log(hex64)

          pubKeys = hexToPubs(hex64)
          _isBitcoin = await isBitcoin(pubKeys)
          console.log(`_isBitcoin code: ${_isBitcoin}`)
          if (_isBitcoin > 0) {
            alertHuman()
            if (config.stopOnFindings) process.exit(0)
          }
        }
      }
      chapterIndex = 0;
      verseIndex = 0;
    }
    chapters = null
  }
}

main(0, 0, 0)


