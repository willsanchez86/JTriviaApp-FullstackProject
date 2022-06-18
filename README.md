# JTrivia!
### Overview
Based on the popular game show Jeopardy, this application's gameplay was implemented using raw JavaScript (no libraries) for DOM Manipulation through event handlers. This database contains nearly 50,000 questions to keep users on their toes and constantly entertained. 

<strong>Disclaimer:</strong>  -Trivia is a non-profit web app created solely for educational purposes. Database contains questions from JeopardyQuestions.com, which was created by fans, for fans. The Jeopardy! game show and all elements thereof, including but not limited to copyright and trademark thereto, are the property of Jeopardy Productions, Inc. and are protected under law. This website is not affiliated with, sponsored by, or operated by Jeopardy Productions, Inc.

<a href="https://will-jtrivia.herokuapp.com/"><img src="https://img.shields.io/badge/-DEMO-4E69C8?style=for-the-badge&logo=appveyor;link=https://will-jtrivia.herokuapp.com/" alt="DEMO"></a>


### Features
* Scrapy application used to scrape 50,000 questions into the Sqlite3 Database
* Python/Flask Back-End 
* Autocomplete text box helps prevent incorrect answers due to incorrect spelling, which keeps the gameplay more authentic without the need for multiple choice questions
* Registration & Authentication utilize both JavaScript(requirement validation) and then Python(hashing, check, and granting access)


### Installation And Startup
* cd to the directory where requirements.txt is located
* activate your virtualenv
* run: pip install -r requirements.txt in your shell
* Setup Flask App:
  * On Command Prompt/Bash:
      run: set FLASK_APP=main.py
  * On powershell
      run: $env:FLASK_APP = "main.py"
* run: flask run

```bash
  Clone the repository and change directory into it:
  
  git clone https://github.com/willsanchez86/nft-minting-dapp.git 
  cd nft-minting-dapp

  npm install            # Download packages
  npm start              # Run the dev server
```


### Gameplay
* You will be presented with six categories and five clues for each category. Each clue will be listed by it's "dollar value."
* Click on a clue to reveal it's question and a form to submit your answer.
* If you have answered correctly, the clue's dollar value will be add to your score. If you have answered incorrectly, the dollar value will be taken away from your score.

## Development


# NFT Minting Dapp


### Installation & Startup
  
```bash
  Clone the repository and change directory into it:
  
  git clone https://github.com/willsanchez86/nft-minting-dapp.git 
  cd nft-minting-dapp

  npm install            # Download packages
  npm start              # Run the dev server
```



### Usage & Details
Simple UI displayed as a stand-alone web page. This is intentionally separated from OrganizedCrimeApes.com to improve operational speed & efficiency in anticipation of heavy site traffic on launch day. 


### Future Releases
Official Minting Date is still pending, but future release will include the following:
* Deployment to Mainnet
* Gas Optimized ERC-721A Smart Contract
* Built-in Royalties for Secondary Sales
* Terms of Service - pending writeup from OCA


### Credits
* <a href="https://docs.openzeppelin.com/">OpenZeppelin</a> ERC-721 Smart Contract Standard
* <a href="https://etherscan.io/address/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d#code">Bored Ape Yacht Club Smart Contract </a> customized with inspiration  from <a href="https://github.com/hashlips-lab/nft-erc721-collection/blob/main/smart-contract/contracts/YourNftToken.sol">Hashlips</a> to ensure secure, and tested contract implementation. 
* <a href="https://docs.blocknative.com/onboard">Blocknative</a> used for onboarding and connecting customer wallets
* <a href="https://docs.alchemy.com/alchemy/">Alchemy</a> supernode removes the need for running a self-hosted node for this web3 application
