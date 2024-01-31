// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "contracts/ProjectToken.sol";

contract ProjectTokenFactory {
    address public apiAddress;

    enum WhitelistStatus {
        NotApplied,
        Pending,
        Approved
    }

    constructor(address _apiAddress) {
        apiAddress = _apiAddress;
    }

    mapping(address => WhitelistStatus) public whitelist;

    struct ProjectStruct{
        address owner;
        string title;
        string description;
        uint256 initialValuation;
        string fiatCurrency;
    }

    event UserWhitelisted(address u);
    event UserPending(address u);

    struct ProjectAndToken {
        ProjectStruct project;
        ProjectToken token;
    }

    ProjectAndToken[] internal projectsAndTokens;
    
    function createProject(string memory _title, string memory _description, string memory _symbol, uint256 _initialSupply, uint256 _initialValuation, string memory _fiatCurrency) public userWhitelisted(msg.sender) returns (ProjectAndToken memory){
        ProjectStruct memory project = ProjectStruct(msg.sender, _title, _description, _initialValuation, _fiatCurrency);
        ProjectToken token = new ProjectToken(msg.sender, _title, _symbol, _initialSupply, this);
        ProjectAndToken memory p_t = ProjectAndToken(project, token);
        projectsAndTokens.push(p_t);
        return p_t;
    }

    function isWhitelisted(address userAddress) public view returns (bool) {
        return whitelist[userAddress] == WhitelistStatus.Approved;
    }

    function getProjects() public view returns (ProjectAndToken[] memory) {
        return projectsAndTokens;
    }

    modifier userWhitelisted(address userAddress) {
        require(isWhitelisted(userAddress), "User is not whitelisted");
        _;
    }

    modifier onlyAPI(address userAddress) {
        require(
            userAddress == apiAddress,
            "Only API can call this function"
        );
        _;
    }

    function whitelistUser(
        address userAddress,
        WhitelistStatus status
    ) public onlyAPI(msg.sender) {
        whitelist[userAddress] = status;
        if(status == WhitelistStatus.Approved){
            emit UserWhitelisted(userAddress);
        }
        else if(status == WhitelistStatus.Pending){
            emit UserPending(userAddress);
        }
    }
}