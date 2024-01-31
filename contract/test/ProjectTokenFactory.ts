import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ProjectTokenFactory", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, apiSigner] = await ethers.getSigners();

    const ProjectTokenFactory = await ethers.getContractFactory("ProjectTokenFactory");
    const projectTokenFactory = await ProjectTokenFactory.deploy(apiSigner);

    return { projectTokenFactory, owner, otherAccount, apiSigner };
  }


  describe("Deployment", function () {
    it("Whitelist should be empty", async function () {
      const { projectTokenFactory, owner } = await loadFixture(deployFixture);
      expect(await projectTokenFactory.whitelist(owner)).to.equal(0n);
    });
    it("Should not be able to whitelist", async function () {
      const { projectTokenFactory, otherAccount } = await loadFixture(deployFixture);
      await expect(projectTokenFactory.whitelistUser(otherAccount, 0)).to.be.revertedWith('Only API can call this function');
    });
    it("Should be able to whitelist", async function () {
      const { projectTokenFactory, otherAccount, apiSigner } = await loadFixture(deployFixture);
      await projectTokenFactory.connect(apiSigner).whitelistUser(otherAccount, 1);
      expect(await projectTokenFactory.whitelist(otherAccount)).to.equal(1n);
    });
  });

  describe("Projects", function () {
    it("Should not be able to create project while not whitelisted", async function () {
      const { projectTokenFactory, otherAccount } = await loadFixture(deployFixture);
      await expect(projectTokenFactory.connect(otherAccount).createProject("title", "desc", "ABC", 5)).to.be.revertedWith('User is not whitelisted');
  });
  });
});