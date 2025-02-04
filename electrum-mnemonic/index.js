import mn from 'electrum-mnemonic'


const phrase = mn.generateMnemonic({ prefix: mn.PREFIXES.standard })
// const seed = mn.mnemonicToSeedSync(phrase, { prefix: mn.PREFIXES.standard })
// console.log(seed)
// const phrase = mn.generateMnemonic()
// console.log(phrase)
// const segwitSeed = mn.mnemonicToSeedSync(phrase, { prefix: mn.PREFIXES.standard })
// console.log(segwitSeed)

for (let prefix in mn.PREFIXES) {
	mn.mnemonicToSeedSync(phrase, { prefix })
}