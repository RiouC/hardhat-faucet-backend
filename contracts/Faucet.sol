//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/utils/Address.sol";
import "./Token.sol";

/**
*@title A simple Faucet Contract
*@author Karim Derradji
*@notice You can use this contract for a decentralized Faucet, yet it is not recomanded to do so.
*@dev Functions are basic, the app is highly restricted for security issues.  
* */
pragma solidity ^0.8.4;

contract SmartSinkHole {
    /**
    *@dev This consumation of Address library is optional, so you can buy tokenFaucet with fake eth
    * */
    using Address for address payable;

    Token private _tokenInstance;

    address private _mario = '0xeAD32266A76386c44d1aF267342f66bdd7f1881d';

    /**
    *@dev The rate with which token are sent
    * 10 ** 18 = 1 TOKEN
    * */
    uint256 private _rate = 1 * 10 ** 18;

    /**
    *@dev interval between each withdrawal of token sets to 3 days
    * */
    uint256 constant private _INTERVAL = 3 days; 

    mapping(address => uint256) private _accessCountDown;

    /**
    *@dev constructor for Faucet :
    *@param tokenAddress_ : the address of the token we want to transfer to users
    * */
    constructor(address tokenAddress_) {
        require(tokenAddress_ != address(0), "Faucet");
        _tokenInstance = Token(tokenAddress_);
    }

    function requestTokens( ) public {
        require(allowedToWithdraw(msg.sender) == true, 
        "SmartSinkHole: you're not allowed to withdraw anymore");
        
        _accessCountDown[msg.sender] = block.number + _INTERVAL;
        uint256 amount = 10 * _rate;
        _tokenInstance.transferFrom(_mario, msg.sender, amount);
    }

    function allowedToWithdraw(address _address) public view returns (bool) {
        if(_accessCountDown[_address] == 0) {
            return true;
        } else if(block.timestamp >= _accessCountDown[_address]) {
            return true;
        }
        return false;
    }

}

