// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "contracts/ProjectToken.sol";
contract ProjectTokenMarket {
    struct Listing{
        address seller;
        uint256 amount;
        uint256 pricePerToken;
    }

    // Token to listing
    mapping (ProjectToken => Listing) listings;

    function addTokens(ProjectToken token, uint256 amount, uint256 pricePerToken) public payable {
        require(amount > 0, "Amount should be greater than 0");
        require(pricePerToken > 0, "Price per token should be greater than 0");
        require(token.projectOwner() == msg.sender, "You should be the project owner to sell a token");
        listings[token] = Listing(msg.sender, amount, pricePerToken);
    }
    
    function purchaseTokens(ProjectToken token, uint256 amount) public payable {
        require(amount > 0 && amount <= listings[token].amount, "Invalid amount");
        require(msg.value >= amount * listings[token].pricePerToken, "Incorrect payment amount");
        address owner = token.projectOwner();
        require(msg.sender != owner, "You can't buy your own tokens");

        // Transfer the tokens from the seller to the buyer
        token.transferFrom(owner, msg.sender, amount);

        // Transfer the payment to the seller
        payable(owner).transfer(msg.value);

        // Update the tokens for sale
        listings[token].amount -= amount;
    }
}
