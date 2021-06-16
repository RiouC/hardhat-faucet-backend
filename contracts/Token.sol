//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

pragma solidity ^0.8.4;

contract Token is ERC20 {
    constructor() ERC20("TOKEN", "TKN") {
        
    }
}

