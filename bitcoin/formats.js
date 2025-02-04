import bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib'
// import axios from 'axios';
// import { wait } from '../utils.js';

bitcoin.initEccLib(ecc)
const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

export function xprvToHex(xprv, i = 0) {
  const root = bip32.fromBase58(xprv);
  const privs = [];

  for (let j = i; j < i + 3; j++) {
    const child = root.derivePath(`m/44'/0'/0'/0/${j}`);
    const buffer = Buffer.from(child.privateKey);

    // Ensure privateKey is accessed and converted properly
    if (Buffer.isBuffer(buffer)) {
      const hexPrivateKey = buffer.toString('hex');
      privs.push(hexPrivateKey);
    } else {
      console.error(`Expected a Buffer, but got:`, child.privateKey);
    }
  }

  return privs;
}
export function wifToHex(wif) {
  return ECPair.fromWIF(wif).privateKey.toString('hex')
}

// When you take a BIP39 mnemonic and transform it into WIF format, you're only converting one of the private 
// keys in the HD wallet structure into a format that can be used by Bitcoin software. 
// This doesn't mean the entire wallet (with all its addresses) is a single private key; 
// it just represents one key from the HD wallet.
export function mnemonicToWif(mnemonic) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  // Derive the HD wallet key using BIP32 (m/44'/0'/0')
  const root = bip32.fromSeed(seed);
  const privs = [];
  for (let j = 0; j < 3; j++) {
    const child = root.derivePath(`m/44'/0'/0'/0/${j}`);
    privs.push(ECPair.fromPrivateKey(Buffer.from(child.privateKey)).toWIF())
  }
  return privs;
}

export function mnemonicToPubs(mnemonic) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
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

export function hexToPubs(hex64) {

  const privateKey = Buffer.from(hex64, 'hex')

  const pubs = [];
  let keyPair = ECPair.fromPrivateKey(privateKey, { network: bitcoin.networks.mainnet, compressed: true })
  let payment = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
  pubs.push(payment.address)

  // P2PKH uncompressed (starts with 1)
  keyPair = ECPair.fromPrivateKey(privateKey, { network: bitcoin.networks.mainnet, compressed: false })
  payment = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
  pubs.push(payment.address)

  // SegWit (starts with bc1q)
  keyPair = ECPair.fromPrivateKey(privateKey, { network: bitcoin.networks.mainnet})
  payment = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey});
  pubs.push(payment.address)


  return pubs;
}

