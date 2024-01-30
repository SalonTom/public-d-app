// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "contracts/ProjectToken.sol";

contract Project {

    address public owner;
    string public title;
    string public description;
    
    constructor(address _owner){
        owner = _owner;
    }
}
