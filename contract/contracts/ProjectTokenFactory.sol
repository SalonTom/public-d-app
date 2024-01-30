   // SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "contracts/ProjectToken.sol";

contract ProjectTokenFactory {

    address constant public whitelistApiAddress = 0xE0f5206BBD039e7b0592d8918820024e2a7437b9;

    enum WhitelistStatus {
        NotApplied,
        Pending,
        Approved
    }

    mapping(address => WhitelistStatus) public whitelist;

    address[] public deployedTokens;

    function createToken(string memory _title, string memory _symbol, uint256 _initialSupply) public userWhitelisted(msg.sender) returns (address){
        ProjectToken newToken = new ProjectToken(_title, _symbol, _initialSupply, this);
        address newTokenAddress = address(newToken);
        deployedTokens.push(newTokenAddress);
        return newTokenAddress;
    }

    function getDeployedTokens() public view returns (address[] memory) {
        return deployedTokens;
    }

    function isWhitelisted(address userAddress) view public returns(bool){
        return whitelist[userAddress] == WhitelistStatus.Approved;
    }

    modifier userWhitelisted(address userAddress){
        require(isWhitelisted(userAddress), "User is not whitelisted");
        _;
    }

    modifier onlyAPI() {
        require(msg.sender == whitelistApiAddress, "Only API can call this function");
        _;
    }


    function whitelistUser(address userAddress) public onlyAPI() {
        whitelist[userAddress] = WhitelistStatus.Approved;
    }
}
