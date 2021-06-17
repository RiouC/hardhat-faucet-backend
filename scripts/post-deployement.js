// abstract
//await token.connect(signerThatHoldToken).approve(faucetContract, 100000000000)

const hre = require('hardhat');

const FILE_PATH = './deployed.json';
const { readFile } = require('fs/promises');

async function main() {
  const [deployer] = await ethers.getSigners();

  let jsonString = '';
  let obj = {};
  try {
    jsonString = await readFile(FILE_PATH, 'utf-8');
    obj = JSON.parse(jsonString);
  } catch (e) {
    console.log('in catch');
    console.error(e.message);
  }

  const Token = await hre.ethers.getContractFactory('Token');
  const token = Token.attach(obj['Token'][hre.network.name]['address']);
  console.log(token.address);
  const Faucet = await hre.ethers.getContractFactory('Faucet');
  const faucet = Faucet.attach(obj['Faucet'][hre.network.name]['address']);
  console.log(faucet.address);

  if (hre.network.name !== 'mainet') {
    await token.connect(deployer).approve(faucet.address, token.totalSupply());
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
