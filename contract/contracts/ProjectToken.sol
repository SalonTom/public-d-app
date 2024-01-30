// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "contracts/ProjectTokenFactory.sol";
import "contracts/Project.sol";

contract ProjectToken is ERC20 {
    
    ProjectTokenFactory _parentFactory;
    Project _parentProject;

    constructor(string memory _title, string memory _symbol, uint256 _initialSupply, ProjectTokenFactory parentFactory, Project parentProject) ERC20(_title, _symbol) {
        _mint(msg.sender, _initialSupply);    
        _parentFactory = parentFactory;
        _parentProject = parentProject;
    }

    modifier userWhitelisted(address userAddress){
        require(_parentFactory.isWhitelisted(userAddress), "User is not whitelisted");
        _;
    }

    function transfer(address recipient, uint256 amount) public override userWhitelisted(recipient) returns (bool) {
        return super.transfer(recipient, amount);
    }
}
 