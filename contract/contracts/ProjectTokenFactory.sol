// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "contracts/ProjectToken.sol";

/// @title Project Token Factory
/// @dev This contract allows the creation and management of project-specific tokens.
contract ProjectTokenFactory {
    /// @dev Decimal places for token calculations.
    uint256 constant DECIMALS = 18;

    /// @dev Address of the API allowed to interact with the contract.
    address public apiAddress;

    /// @dev Enumeration for whitelist status.
    enum WhitelistStatus {
        NotApplied,
        Pending,
        Approved
    }

    /// @dev Constructor to set the initial API address.
    constructor(address _apiAddress) {
        apiAddress = _apiAddress;
    }

    /// @dev Mapping to store the whitelist status of user addresses.
    mapping(address => WhitelistStatus) public whitelist;

    /// @dev Event to signal changes in user whitelist status.
    event UserWhitelistStatus(WhitelistStatus s);
    event ProjectCreated(ProjectAndToken p_t);
    /// @dev Struct to represent project details.
    struct ProjectStruct {
        address owner;
        string title;
        string symbol;
        string description;
        uint256 initialValuation; // Initial valuation in ETH
        uint256 initialTokenNumber; // Initial number of tokens for sale
    }

    /// @dev Struct to encapsulate both the project and its associated token.
    struct ProjectAndToken {
        ProjectStruct project;
        ProjectToken token;
    }

    /// @dev Array to store all created projects and tokens.
    ProjectAndToken[] internal projectsAndTokens;

    /// @dev Function to create a new project and its associated token.
    /// @param _title Title of the project.
    /// @param _description Description of the project.
    /// @param _symbol Symbol for the project token.
    /// @param _initialValuation Initial valuation of the project in ETH.
    /// @param _initialTokenNumber Initial number of tokens for sale.
    /// @return p_t A struct containing the created project and token.
    function createProject(
        string memory _title,
        string memory _description,
        string memory _symbol,
        uint256 _initialValuation,
        uint256 _initialTokenNumber
    ) public userWhitelisted(msg.sender) returns (ProjectAndToken memory p_t) {
        require(bytes(_title).length > 0 , "Title should not be empty");
        require(bytes(_description).length > 0 , "Description should not be empty");
        require(bytes(_symbol).length > 0 , "Symbol should not be empty");
        require(_initialValuation > 0, "Initial valuation should be greater than 0");
        require(_initialTokenNumber > 0 && _initialTokenNumber <= 100*(10**18), "Initial token number should be greater than 0 and less than 100*10^18");
        ProjectStruct memory project = ProjectStruct(
            msg.sender,
            _title,
            _symbol,
            _description,
            _initialValuation,
            _initialTokenNumber
        );
        ProjectToken token = new ProjectToken(msg.sender, _title, _symbol);
        p_t = ProjectAndToken(project, token);
        projectsAndTokens.push(p_t);
        emit ProjectCreated(p_t);
    }

    /// @dev Function to check if a user is whitelisted.
    /// @param userAddress Address of the user.
    /// @return True if the user is whitelisted, otherwise false.
    function isWhitelisted(address userAddress) public view returns (bool) {
        return whitelist[userAddress] == WhitelistStatus.Approved;
    }

    /// @dev Function to retrieve all created projects and tokens.
    /// @return An array of ProjectAndToken structs.
    function getProjects() public view returns (ProjectAndToken[] memory) {
        return projectsAndTokens;
    }

    /// @dev Modifier to ensure that a user is whitelisted.
    /// @param userAddress Address of the user.
    modifier userWhitelisted(address userAddress) {
        require(isWhitelisted(userAddress), "User is not whitelisted");
        _;
    }

    /// @dev Modifier to ensure that only the API can call a specific function.
    /// @param userAddress Address calling the function.
    modifier onlyAPI(address userAddress) {
        require(userAddress == apiAddress, "Only API can call this function");
        _;
    }

    /// @dev Function to whitelist or update the status of a user.
    /// @param userAddress Address of the user.
    /// @param status New whitelist status.
    function whitelistUser(address userAddress, WhitelistStatus status)
        public
        onlyAPI(msg.sender)
    {
        whitelist[userAddress] = status;
        emit UserWhitelistStatus(status);
    }
}
