/* eslint-disable quotes */
/* eslint-disable no-undef */

const { expect } = require('chai');

describe('Faucet', function () {
  let dev, owner, alice, bob, charlie, eve;
  let Faucet, faucet, Token, token;
  let INIT_SUPPLY = ethers.utils.parseEther('100000000');
  beforeEach(async function () {
    [dev, owner, alice, bob, charlie, eve] = await ethers.getSigners();

    Token = await ethers.getContractFactory('Token');
    token = await Token.connect(dev).deploy(owner.address, INIT_SUPPLY);
    await token.deployed();

    Faucet = await ethers.getContractFactory('Faucet');
    faucet = await Faucet.connect(dev).deploy(token.address);
    await faucet.deployed();

    await token.connect(owner).approve(faucet.address, INIT_SUPPLY);
  });

  describe('On deployment', async function () {
    it('Should had transfered the total supply to the faucet', async function () {
      expect(await token.allowance(owner.address, faucet.address)).to.be.equal(INIT_SUPPLY);
    });
  });

  describe('Live Faucet', async function () {
    it('Should send 10 tokens to user', async function () {
      await expect(() => faucet.connect(alice).requestTokens()).to.changeTokenBalance(
        token,
        alice,
        ethers.utils.parseEther('10')
      );
    });
    it('Should decrease Owner TokenBalance', async function () {
      await expect(() => faucet.connect(alice).requestTokens()).to.changeTokenBalance(
        token,
        owner,
        ethers.utils.parseEther('-10')
      );
    });
    it('Should set allowedToWithdraw to false', async function () {
      await faucet.connect(alice).requestTokens();
      expect(await faucet.allowedToWithdraw(alice.address)).to.equal(false);
    });
    it('Should revert if user tries to withdraw before it is allowed again', async function () {
      await faucet.connect(alice).requestTokens();
      await expect(faucet.connect(alice).requestTokens()).to.be.revertedWith(
        "Faucet: you're not allowed to withdraw anymore"
      );
    });
  });
});
