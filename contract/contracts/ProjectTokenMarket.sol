// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "contracts/ProjectToken.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ProjectTokenMarket {
    struct Listing{
        address seller;
        uint256 amount;
        uint256 pricePerToken;
    }

    // Token to listing
    mapping (ProjectToken => Listing) public listings;

    function addTokens(address token, uint256 amount, uint256 pricePerToken) public payable {
        require(amount > 0, "Amount should be greater than 0");
        require(pricePerToken > 0, "Price per token should be greater than 0");
        ProjectToken _token = ProjectToken(token);
        require(_token.projectOwner() == msg.sender, "You should be the project owner to sell a token");
        listings[_token] = Listing(msg.sender, amount, pricePerToken);
    }
    
    function purchaseTokens(address token, uint256 amount) public payable {
        ProjectToken _token = ProjectToken(token);
        require(amount > 0 && amount <= listings[_token].amount, "Cannot buy that amount of tokens");
        
        // Calcul du montant total à payer
        uint256 totalPayment = (amount * listings[_token].pricePerToken) / (1*10**18);

        // Assertion avec un if suivi d'un revert personnalisé
        if (msg.value < totalPayment) {
            revert(string(abi.encodePacked("Insufficient payment. Required : ", Strings.toString(totalPayment))));
        }
        
        address owner = _token.projectOwner();
        require(msg.sender != owner, "You can't buy your own tokens");

        // Transfer the tokens from the seller to the buyer
        _token.transferFrom(owner, msg.sender, amount);

        // Transfer the payment to the seller
        payable(owner).transfer(msg.value);

        // Update the tokens for sale
        listings[_token].amount -= amount;
    }
}
