// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "contracts/ProjectToken.sol";
import "contracts/Project.sol";

contract ProjectTokenFactory {
    address public whitelistApiAddress;

    enum WhitelistStatus {
        NotApplied,
        Pending,
        Approved
    }

    constructor(address _whitelistApiAddress) {
        whitelistApiAddress = _whitelistApiAddress;
    }

    mapping(address => WhitelistStatus) public whitelist;

    address[] internal deployedTokens;

    struct ProjectAndToken {
        Project project;
        ProjectToken token;
    }

    ProjectAndToken[] internal projectsAndTokens;

    function createProject(
        string memory _title,
        string memory _description,
        string memory _symbol,
        uint256 _initialSupply
    ) public userWhitelisted(msg.sender) returns (ProjectAndToken memory) {
        Project project = new Project(msg.sender, _title, _description);
        ProjectToken token = new ProjectToken(
            _title,
            _symbol,
            _initialSupply,
            this
        );
        address tokenAddress = address(token);
        deployedTokens.push(tokenAddress);
        ProjectAndToken memory p_t = ProjectAndToken(project, token);
        projectsAndTokens.push(p_t);
        return p_t;
    }

    function getDeployedTokens() public view returns (address[] memory) {
        return deployedTokens;
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
            userAddress == whitelistApiAddress,
            "Only API can call this function"
        );
        _;
    }

    function whitelistUser(
        address userAddress,
        WhitelistStatus status
    ) public onlyAPI(msg.sender) {
        whitelist[userAddress] = status;
    }
}
