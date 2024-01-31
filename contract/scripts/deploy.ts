import { ethers }from "hardhat";
import { Wallet, SigningKey } from "ethers";
import { ProjectTokenFactory } from "../typechain-types";
const path = require("path");

async function main() {
  // Types Wallet | HardhatEthersSigner 
  let apiSigner;
  
  if((await ethers.provider.getNetwork()).name === "hardhat") {
    console.log("Hardhat local network detected, setting the first account as API signer");
    apiSigner = (await ethers.getSigners())[0];
  } else{
    console.log("Remote network detected, generating a random API signer");
    let signingKey = ethers.randomBytes(32);
    apiSigner = new Wallet(new ethers.SigningKey(signingKey), ethers.provider);
  }
  const projectTokenFactory = await ethers.deployContract("ProjectTokenFactory", [apiSigner.address]);

  await projectTokenFactory.waitForDeployment();

  console.log(`Contract deployed to ${projectTokenFactory.target}, API signer is ${apiSigner.address} ${"privateKey" in apiSigner ? ` with private key ${apiSigner.privateKey}` : ''}`);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(projectTokenFactory);
}

function saveFrontendFiles(projectTokenFactory: ProjectTokenFactory) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "Address.json"),
    JSON.stringify({ Address: projectTokenFactory.target }, undefined, 2)
  );

  const ProjectTokenFactoryArtifact = artifacts.readArtifactSync("ProjectTokenFactory");

  fs.writeFileSync(
    path.join(contractsDir, "ProjectTokenFactory.json"),
    JSON.stringify(ProjectTokenFactoryArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});