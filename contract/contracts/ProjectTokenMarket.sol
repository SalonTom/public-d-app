// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "contracts/ProjectToken.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title Project Token Market
/// @dev This contract facilitates the buying and selling of project-specific tokens.
contract ProjectTokenMarket {
    /// @dev Struct to represent a token listing.
    struct Listing {
        address seller;
        uint256 amount;
        uint256 pricePerToken;
    }

    /// @dev Mapping from ProjectToken to Listing to keep track of tokens available for sale.
    mapping(ProjectToken => Listing) public listings;

    /// @dev Function to add tokens to the market for sale.
    /// @param token Address of the token to be listed for sale.
    /// @param amount The quantity of tokens to be listed.
    /// @param pricePerToken The price per token in wei.
    function addTokens(address token, uint256 amount, uint256 pricePerToken) public payable {
        require(amount > 0, "Amount should be greater than 0");
        require(pricePerToken > 0, "Price per token should be greater than 0");

        // Ensure the sender is the project owner.
        ProjectToken _token = ProjectToken(token);
        require(_token.projectOwner() == msg.sender, "You should be the project owner to sell a token");
        // Ensure the sender has the required balance and allowance.
        require(_token.balanceOf(msg.sender) >= amount, "Insufficient balance to sell, you don't own that many tokens");
        require(_token.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance to sell, please call approve() first");
        
        // Set the listing details for the token.
        listings[_token] = Listing(msg.sender, amount, pricePerToken);
    }
    
    /// @dev Function to purchase tokens from the market.
    /// @param token Address of the token to be purchased.
    /// @param amount The quantity of tokens to be purchased.
    function purchaseTokens(address token, uint256 amount) public payable {
        // Retrieve the token and check the validity of the purchase.
        ProjectToken _token = ProjectToken(token);
        require(amount > 0 && amount <= listings[_token].amount, "Cannot buy that amount of tokens");

        // Calculate the total payment required.
        uint256 totalPayment = (amount * listings[_token].pricePerToken) / (1*10**18);

        // Check if the sent value is sufficient.
        require(msg.value >= totalPayment, string(abi.encodePacked("Insufficient payment. Required : ", Strings.toString(totalPayment), " Sent : ", Strings.toString(msg.value))));

        // Ensure the buyer is not the project owner.
        address owner = _token.projectOwner();
        require(msg.sender != owner, "You can't buy your own tokens");

        // Transfer the tokens from the seller to the buyer.
        _token.transferFrom(owner, msg.sender, amount);

        // Transfer the payment to the seller.
        payable(owner).transfer(msg.value);

        // Update the tokens for sale.
        listings[_token].amount -= amount;
    }
}
