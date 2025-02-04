// TODO

// import db from './db.js'
import * as bitcoin from 'bitcoinjs-lib'
// import { ECPairFactory } from 'ecpair'
import * as ecc from 'tiny-secp256k1'
import { mnemonicToPubs, wifToHex, xprvToHex, hexToPubs } from './formats.js';
import axios from 'axios';
import { wait } from '../utils.js';
// import crypto from "crypto";

// const ECPair = ECPairFactory(ecc);

bitcoin.initEccLib(ecc)

const services = [
  {
    name: 'blockcypher',
    url: 'https://api.blockcypher.com/v1/btc/main/addrs/',
    check( { balance, final_balance, total_received }) {
      // console.log("balance", balance)
      // console.log("final_balance", final_balance)
      if (balance > 0 || final_balance > 0) {
        console.log(" ***  BTC FUNDS DETECTED *** ")
        return 1
      } else if (total_received > 0) {
        console.log("BTC HAS NO FUNDS BUT IT WAS ACTIVE")
        return 2
      } else {
        return 0
      }
    }
  },
  {
    name: 'mempool',
    url: 'https://mempool.space/api/address/',
    check({ chain_stats }) {
      const { funded_txo_sum, spent_txo_sum } = chain_stats;
      if (funded_txo_sum > spent_txo_sum) {
        console.log(" ***  BTC FUNDS DETECTED *** ")
        return 1
      } else if (spent_txo_sum > 0) {
        console.log("BTC HAS NO FUNDS BUT IT WAS ACTIVE")
        return 2
      } else {
        return 0
      }
    }
  },
  {
    name: 'blockstream',
    url: 'https://blockstream.info/api/address/',
    check({ chain_stats }) {
      const { funded_txo_sum, spent_txo_sum } = chain_stats;
      if (funded_txo_sum > spent_txo_sum) {
        console.log(" ***  BTC FUNDS DETECTED *** ")
        return 1
      } else if (spent_txo_sum > 0) {
        console.log("BTC HAS NO FUNDS BUT IT WAS ACTIVE")
        return 2
      } else {
        return 0
      }
    } 
  },
  {
    name: 'btcscan',
    url: 'https://btcscan.org/api/address/',
    check({ chain_stats }) {
      const { funded_txo_sum, spent_txo_sum } = chain_stats;
      if (funded_txo_sum > spent_txo_sum) {
        console.log(" ***  BTC FUNDS DETECTED *** ")
        return 1
      } else if (spent_txo_sum > 0) {
        console.log("BTC HAS NO FUNDS BUT IT WAS ACTIVE")
        return 2
      } else {
        return 0
      }
    }
  }
]
let serviceIndex = 0;
// let service = services[serviceIndex]

const isBitcoin = async (pubs, j = 0, status = 0) => {
  for (let i = j; i < pubs.length; i++) {
    const maybe = pubs[i]
    let url = services[serviceIndex].url+maybe
    console.log(url)
    
    try {
      let result = await axios.get(url, {timeout: 3000}).then(res => res.data)
      console.log(JSON.stringify(result))
      if (services[serviceIndex].check(result) == 1) {
        return 1;
      } else if (services[serviceIndex].check(result) == 2) {
        status = 2;
      }
    } catch(e) {
      // console.log(e)
      console.log('Cannot fetch balance ...')
      serviceIndex = (serviceIndex + 1) % services.length;
      console.log(`ServiceIndex = ${serviceIndex}`)
      console.log(`Swithching to ${services[serviceIndex].name}`)
      await wait(2000)
      return isBitcoin(pubs, i, status)
    }
    await wait(500)
  }
  return status;
}


export {
  isBitcoin,
  mnemonicToPubs,
  wifToHex,
  xprvToHex,
  hexToPubs
}