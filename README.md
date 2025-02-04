# bitcoinBible

`bitcoinBible` is a Node.js application that searches through all books, chapters, and verses of the **King James Bible** to uncover potential hidden Bitcoin wallet information. The program has multiple modes that explore verses for mnemonics and hashes, helping to identify hidden Bitcoin-related data in religious text.

The project supports the following operations:

1. **Finding Electrum mnemonics** in each verse
2. **Finding BIP39 mnemonics** in each verse
3. **SHA256 hashing** of each verse
4. **SHA256 hashing in reverse** mode (verses processed in reverse order)

## Contributing

We welcome contributions to enhance the functionality of `bitcoinBible`. If you'd like to add new scanning features, here are a few ideas:

- Implement simple encryption methods, such as **Caesar cipher**, before hashing the verse.
- Add modes to process the verse in **all lowercase** and **all uppercase**.
- Integrate **Gematria** calculations to uncover hidden meanings.

Feel free to submit pull requests or open issues with ideas and improvements!

The project supports the following operations:

1. **Finding Electrum mnemonics** in each verse
2. **Finding BIP39 mnemonics** in each verse
3. **SHA256 hashing** of each verse
4. **SHA256 hashing in reverse** mode (verses processed in reverse order)

## Features

- Search for **Electrum** mnemonics in each Bible verse
- Search for **BIP39** mnemonics in each Bible verse (if implemented)
- **SHA256** hash of each verse and its reverse
- Optionally **stop execution** once a match is found
- Easily configurable via `config.json` file

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Modes](#modes)
- [Project Structure](#project-structure)
- [License](#license)

## Installation

### Prerequisites

Before you begin, make sure you have the following software installed:

- **Node.js**: Version 12 or higher. You can download it from [here](https://nodejs.org/).
- **npm**: Node package manager (comes with Node.js).

### Steps to Install

1. **Clone the Repository**

   Clone the project repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/bitcoinBible.git
   ```

2. **Navigate to the Project Folder**

   Change to the project directory:

   ```bash
   cd bitcoinBible
   ```

3. **Install Dependencies**

After navigating to the project folder, install the necessary Node.js dependencies by running the following command:

```bash
npm install
```

4. **Run the Script**

Once the dependencies are installed, you can start the application by running the following command:

```bash
node main.js
```

## Configuration

The application's behavior can be customized using the `config.json` file located in the project directory.

### Available Configuration Options

- `searchForElectrumWords`: 
  - **Type**: `Boolean`
  - **Default**: `false`
  - **Description**: Set this to `true` to search for **Electrum** mnemonics in each Bible verse.

- `reversedMode`: 
  - **Type**: `Boolean`
  - **Default**: `false`
  - **Description**: Set this to `true` to reverse the verse text before processing it (applies to both hashing and mnemonic search).

- `stopOnFindings`: 
  - **Type**: `Boolean`
  - **Default**: `true`
  - **Description**: If set to `true`, the script will stop execution as soon as a matching wallet or mnemonic is found.

### Example `config.json`:

```json
{
  "searchForElectrumWords": false,
  "reversedMode": false,
  "stopOnFindings": true
}
```
## Donations

If you find this project useful and would like to support its development, you can donate Bitcoin to the following address:

**Bitcoin Address**: `bc1qpg5qavn00ujhtqxqzt4m0pj3u5v35qdgalsn45`

Thank you for your support!
