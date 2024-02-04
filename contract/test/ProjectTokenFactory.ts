import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { fromBlockchainFloat, toBlockchainFloat} from "./utils";
import { ProjectTokenFactory } from "../typechain-types";

enum WhitelistStatus{
  NotApplied,
  Pending,
  Approved
}

describe("ProjectTokenFactory", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, apiSigner, otherAccount2 ] = await ethers.getSigners();

    const ProjectTokenFactory = await ethers.getContractFactory("ProjectTokenFactory");
    const projectTokenFactory = await ProjectTokenFactory.deploy(apiSigner);

    const ProjectTokenMarket = await ethers.getContractFactory("ProjectTokenMarket");
    const projectTokenMarket = await ProjectTokenMarket.deploy();

    return { projectTokenFactory, projectTokenMarket, owner, otherAccount, apiSigner, otherAccount2};
  }


  describe("Deployment", function () {
    it("Whitelist should be empty", async function () {
      const { projectTokenFactory, owner } = await loadFixture(deployFixture);
      expect(await projectTokenFactory.whitelist(owner)).to.equal(0n);
    });
    it("Should not be able to whitelist", async function () {
      const { projectTokenFactory, otherAccount } = await loadFixture(deployFixture);
      await expect(projectTokenFactory.whitelistUser(otherAccount, WhitelistStatus.Approved)).to.be.revertedWith('Only API can call this function');
    });
    it("Should be able to whitelist", async function () {
      const { projectTokenFactory, otherAccount, apiSigner } = await loadFixture(deployFixture);
      await expect(await projectTokenFactory.connect(apiSigner).whitelistUser(otherAccount, WhitelistStatus.Approved)).to.emit(projectTokenFactory, "UserWhitelistStatus");
      expect(await projectTokenFactory.whitelist(otherAccount)).to.equal(WhitelistStatus.Approved);
    });
  });

  describe("Project and token", function () {
    const VALID_INITIAL_TOKEN_NUMBER = toBlockchainFloat(20); // 20 % of the total supply of tokens (shares) 
    const VALID_INITIAL_VALUATION = toBlockchainFloat(1.5); // 1.5 ETH per token price 
    it("Should not be able to create project while not whitelisted", async function () {
      const { projectTokenFactory, otherAccount } = await loadFixture(deployFixture);
      await expect(projectTokenFactory.connect(otherAccount).createProject("title", "desc", "ABC", VALID_INITIAL_VALUATION, toBlockchainFloat(20))).to.be.revertedWith('User is not whitelisted');
  });
  // test for when user is whitelisted but you try to enter a invalid _initialTokenNumber (supposed to be between 0.1 and 100)
  it("Should check the token initial supply (between 0 and 100)", async function () {
    const { projectTokenFactory, otherAccount, apiSigner } = await loadFixture(deployFixture);
    await projectTokenFactory.connect(apiSigner).whitelistUser(otherAccount, WhitelistStatus.Approved);
    await expect(projectTokenFactory.connect(otherAccount).createProject("title", "desc", "ABC", VALID_INITIAL_VALUATION, toBlockchainFloat(0))).to.be.revertedWith('Initial token number should be greater than 0 and less than 100*10^18');
    await expect(projectTokenFactory.connect(otherAccount).createProject("title", "desc", "ABC", VALID_INITIAL_VALUATION, toBlockchainFloat(100.1))).to.be.revertedWith('Initial token number should be greater than 0 and less than 100*10^18');
  });
  // test for when user is whitelisted but you try to enter a invalid _initialPrice (supposed to be greater than 0)
  it("Should check the token initial price (greater than 0)", async function () {
    const { projectTokenFactory, otherAccount, apiSigner } = await loadFixture(deployFixture);
    await projectTokenFactory.connect(apiSigner).whitelistUser(otherAccount, WhitelistStatus.Approved);
    await expect(projectTokenFactory.connect(otherAccount).createProject("title", "desc", "ABC", toBlockchainFloat(0), VALID_INITIAL_TOKEN_NUMBER)).to.be.revertedWith('Initial valuation should be greater than 0');
  });
  // test for when user is whitelisted and you try to create a project with valid parameters
  it("Should create a project", async function () {
    const { projectTokenFactory, otherAccount, apiSigner } = await loadFixture(deployFixture);
    await projectTokenFactory.connect(apiSigner).whitelistUser(otherAccount, WhitelistStatus.Approved);
    // Check if the event is emitted
    await expect(
      projectTokenFactory
      .connect(otherAccount)
      .createProject("title", "desc", "ABC", VALID_INITIAL_VALUATION, VALID_INITIAL_TOKEN_NUMBER))
      .to.emit(projectTokenFactory, "ProjectCreated");
    // Retrieve the project and token
    const result = (await projectTokenFactory.connect(otherAccount).getProjects())[0];
    const project = result[0];
    const token = await ethers.getContractAt("ProjectToken", result[1]);
    // Check if the project is created with the correct parameters
    expect(project.title).to.equal("title");
    expect(project.description).to.equal("desc");
    expect(project.owner).to.equal(otherAccount.address);
    expect(project.initialTokenNumber).to.equal(VALID_INITIAL_TOKEN_NUMBER);
    expect(project.initialValuation).to.equal(VALID_INITIAL_VALUATION);
    // Check if the token is created with the correct parameters
    await expect(await token.projectOwner()).to.equal(otherAccount.address);
    await expect(await token.balanceOf(otherAccount.address)).to.equal(toBlockchainFloat(100));
    await expect(await token.totalSupply()).to.equal(toBlockchainFloat(100));
  });
  it("Should be able to list a token to sell and buy it", async function () {
    const { projectTokenFactory, projectTokenMarket, otherAccount, apiSigner, otherAccount2 } = await loadFixture(deployFixture);
    
    // Whitelist otherAccount
    await projectTokenFactory.connect(apiSigner).whitelistUser(otherAccount, WhitelistStatus.Approved);
    
    // otherAccount creates a project
    await projectTokenFactory.connect(otherAccount).createProject("title", "desc", "ABC", VALID_INITIAL_VALUATION, VALID_INITIAL_TOKEN_NUMBER);
    
    // otherAccount retrieves the token
    const result = (await projectTokenFactory.connect(otherAccount).getProjects())[0];
    const project = result[0];
    const token = await ethers.getContractAt("ProjectToken", result[1]);
    
    // otherAccount lists the token to sell
    await expect(await token.connect(otherAccount).approve(projectTokenMarket.getAddress(), VALID_INITIAL_TOKEN_NUMBER)).to.emit(token, "Approval");
    await projectTokenMarket.connect(otherAccount).addTokens(token.getAddress(), VALID_INITIAL_TOKEN_NUMBER, VALID_INITIAL_VALUATION);
    
    // Check if the token is listed
    const listing = await projectTokenMarket.listings(token.getAddress());
    await expect(listing).to.deep.equal([otherAccount.address,VALID_INITIAL_TOKEN_NUMBER, VALID_INITIAL_VALUATION]);
    
    // otherAccount2 buys 5% of shares (5 * 10^18 tokens)
    let etherToPayInWei = fromBlockchainFloat((listing.pricePerToken * toBlockchainFloat(5)));
    const purchaseTokensTx = projectTokenMarket.connect(otherAccount2).purchaseTokens(token.getAddress(), toBlockchainFloat(5), {value: etherToPayInWei});
    
    // Check if the ether has been transferred
    await expect(purchaseTokensTx).to.changeEtherBalance(otherAccount2, -etherToPayInWei);
    await expect(purchaseTokensTx).to.changeEtherBalance(otherAccount, etherToPayInWei);

    // Check if the token has been transferred
    await expect(await token.balanceOf(otherAccount2.address)).to.equal(toBlockchainFloat(5));
    
    // Check if the owner of the token has the correct balance of tokens
    await expect(await token.balanceOf(otherAccount.address)).to.equal(toBlockchainFloat(100) - toBlockchainFloat(5));
    
    // Check if the listing has been updated
    const updatedListing = await projectTokenMarket.listings(token.getAddress());
    await expect(updatedListing).to.deep.equal([otherAccount.address, toBlockchainFloat(15), VALID_INITIAL_VALUATION]);

  });
});
});