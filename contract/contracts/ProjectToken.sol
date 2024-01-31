// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "contracts/ProjectTokenFactory.sol";

contract ProjectToken is ERC20 {

    ProjectTokenFactory _parentFactory;

    constructor(address _mintRecipient, string memory _name, string memory _symbol, uint256 _initialSupply, ProjectTokenFactory parentFactory) ERC20(_name, _symbol) {
        require(_initialSupply < 100 && _initialSupply > 1, "The supply must be between 1 and 100");
        _mint(_mintRecipient, _initialSupply);    
        _parentFactory = parentFactory;
        
    }

    modifier userWhitelisted(address userAddress){
        require(_parentFactory.isWhitelisted(userAddress), "User is not whitelisted");
        _;
    }
}
 