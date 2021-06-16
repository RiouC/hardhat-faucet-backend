//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address private _owner;
    uint256 private _initialSupply;

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor(address owner_, uint256 initialSupply_) ERC20("Token", "KCA") {
        _owner = owner_;

        _initialSupply = initialSupply_;
        _mint(owner_, initialSupply_ * 10 ** decimals());
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Returns the initial supply of the ERC20
     */
    function initialSupply() public view returns (uint256) {
        return _initialSupply;
    }
}

