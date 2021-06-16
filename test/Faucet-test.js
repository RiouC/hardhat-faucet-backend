/* eslint-disable quotes */
/* eslint-disable no-undef */


const { expect } = require('chai');

describe('Faucet', function () {
  let dev, owner, alice, bob, charlie, eve, Faucet, faucet, Token, token;
  let INIT_SUPPLY = ethers.utils.parseEther('100000000')
  beforeEach(async function () {
    [dev, owner, alice, bob, charlie, eve] = await ethers.getSigners()

    Token = await ethers.getContractFactory('Token');
    token = await Token.connect(dev).deploy(owner.address, INIT_SUPPLY);

    await token.deployed();

    Faucet = await ethers.getContractFactory('Faucet');
    faucet = await Faucet.connect(dev).deploy(token.address);

    await faucet.deployed();

    await token.connect(owner).approve(faucet.address, INIT_SUPPLY)
  })

  describe('On deployment', async function () {
    it("Should had transfered the total supply to the faucet", async function () {
      expect(await token.allowance(owner.address, faucet.address)).to.be.equal(INIT_SUPPLY);
    });
  })
  
});
