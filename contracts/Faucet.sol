//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/utils/Address.sol";
import "./Token.sol";

/**
 *@title A simple Faucet Contract
 *@author Karim Derradji
 *@notice You can use this contract for a decentralized Faucet, yet it is not recomanded to do so.
 *@dev Functions are basic, the app is highly restricted for security issues.
 */
pragma solidity ^0.8.4;

contract Faucet {
    /**
     * @dev This consumation of Address library is optional, so you can buy tokenFaucet with fake eth
     */
    using Address for address payable;

    Token private _tokenInstance;

    /**
     * @dev The rate with which token are sent
     * 10 ** 18 = 1 TOKEN
     */
    uint256 private _rate = 1 * 10**18;

    /**
     *@dev interval between each withdrawal of token sets to 3 days
     */
    uint256 private constant _INTERVAL = 3 days;

    /**
     * @dev mapping to keep track of access control relying on time
     * access is restricted on withdraw with :
     */
    mapping(address => uint256) private _lastAccess;

    event TokenSent(address indexed recipient, uint256 amount);

    event TimeRemaining(uint256 currentTimestamp, uint256 timestampLastAccess);

    /**
     * @dev constructor for Faucet :
     * @param tokenAddress_ : the address of the token we want to transfer to users
     */
    constructor(address tokenAddress_) {
        require(tokenAddress_ != address(0), "Faucet");
        _tokenInstance = Token(tokenAddress_);
    }

    /**
     * @dev function to request tokens from the faucet
     * emit a TokenSent event
     */
    function requestTokens() public {
        if (allowedToWithdraw(msg.sender) == false) {
            emit TimeRemaining(block.timestamp, _lastAccess[msg.sender]);
        }
        require(allowedToWithdraw(msg.sender) == true, "Faucet: you're not allowed to withdraw anymore");

        _lastAccess[msg.sender] = block.timestamp + _INTERVAL;
        uint256 amount = 10 * _rate;
        _tokenInstance.transferFrom(_tokenInstance.owner(), msg.sender, amount);

        emit TokenSent(msg.sender, amount);
    }

    /**
     * @notice Check if address_ can claim tokens again
     * @dev we emit a TimeRemaining event to calculate how much time
     * the user has to wait before claiming token again
     * @return true or false
     */
    function allowedToWithdraw(address address_) public view returns (bool) {
        if (_lastAccess[address_] == 0) {
            return true;
        } else if (block.timestamp >= _lastAccess[address_]) {
            return true;
        }
        return false;
    }
}
