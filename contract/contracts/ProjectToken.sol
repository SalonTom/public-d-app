// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ProjectToken is ERC20 {

    constructor(address _mintRecipient, string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        _mint(_mintRecipient, 100 * 10**decimals()); // 18 decimals by default     
    }
}
 