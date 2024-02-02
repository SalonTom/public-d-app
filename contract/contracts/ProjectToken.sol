// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Project Token
/// @dev This ERC20 token represents the number of shares you own in a specific project.
/// @author Cocosaurus Rex
/// @notice This token is customized and deployed for each project. It includes functionality to mint an initial supply
/// of shares to a designated recipient, typically the project owner.
contract ProjectToken is ERC20 {
    /// @dev Address of the project owner who initially receives all the minted shares.
    address public projectOwner;

    /// @dev Constructor to initialize the Project Token.
    /// @param _mintRecipient The address that will receive the initial supply of shares.
    /// @param _name The name of the token.
    /// @param _symbol The symbol of the token.
    constructor(address _mintRecipient, string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        // Mint an initial supply of 100 shares to the specified recipient.
        _mint(_mintRecipient, 100 * 10**decimals()); // 18 decimals by default

        // Set the project owner to the specified recipient.
        projectOwner = _mintRecipient;
    }
}