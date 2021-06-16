/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const { readFile } = require('fs/promises');
const hre = require('hardhat');
const { deployed } = require('./deployed');
// const deploy_token = require('./deploy-Token.js');
const FILE_PATH = './deployed.json';

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // appeler deploy-token pour déployer le token ERC20
  // récupérer l'address de l'ERC20 dans le json
  // await deploy_token.main();
  // TO FIX

  // Optionnel car l'account deployer est utilisé par défaut
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  let jsonString = '';
  let obj = {};
  try {
    jsonString = await readFile(FILE_PATH, 'utf-8');
    obj = JSON.parse(jsonString);
  } catch (e) {
    // If does not exist, do nothing
    console.log('in catch');
    console.error(e.message);
  }

  // We get the contract to deploy
  const Token = await hre.ethers.getContractFactory('Token');
  const token = await Token.attach(obj['Token']['hardhat']['address']);
  // old version
  // const token = await Token.attach('0x5FbDB2315678afecb367f032d93F642f64180aa3');

  // We get the contract to deploy
  const Faucet = await hre.ethers.getContractFactory('Faucet');
  console.log(obj); // Debug
  const faucet = await Faucet.deploy(obj['Token']['hardhat']['address']);

  // Attendre que le contrat soit réellement déployé, cad que la transaction de déploiement
  // soit incluse dans un bloc
  await faucet.deployed();

  // Create/update deployed.json and print usefull information on the console.
  await deployed('Faucet', hre.network.name, faucet.address);

  if (hre.network.name !== 'mainet') {
    console.log('in !== mainet');
    // approve
    // TOFIX
    // await token.connect(deployer).approve(faucet.address, token.totalSupply());
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
