import { ethers , config }from "hardhat";
import { Wallet, SigningKey } from "ethers";
import { ProjectTokenFactory } from "../typechain-types";
const path = require("path");

async function main() {
  // Types Wallet | HardhatEthersSigner 
  let apiSigner;
  
  if((await ethers.provider.getNetwork()).name === "hardhat" || (await ethers.provider.getNetwork()).name === "localhost") {
    console.log("Hardhat local network detected, setting the first account as API signer");
    const privateKeyHex = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

    const privateKeyBytes = Buffer.from(privateKeyHex, 'hex');

    const signingKey = new ethers.SigningKey(privateKeyBytes);

    apiSigner = new ethers.Wallet(signingKey, ethers.provider);
  } else{
    console.log("Remote network detected, generating a random API signer");
    let signingKey = ethers.randomBytes(32);
    apiSigner = new Wallet(new ethers.SigningKey(signingKey), ethers.provider);
  }
  console.log(apiSigner)
  const projectTokenFactory = await ethers.deployContract("ProjectTokenFactory", [apiSigner.address]);

  await projectTokenFactory.waitForDeployment();

  console.log(`Contract deployed to ${projectTokenFactory.target}, API signer is ${apiSigner.address} ${"privateKey" in apiSigner ? ` with private key ${apiSigner.privateKey}` : ''}`);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(projectTokenFactory,apiSigner);
}

function saveFrontendFiles(projectTokenFactory: ProjectTokenFactory,apiSigner) {
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


  fs.writeFileSync(
      path.join(contractsDir, "API.json"),
      JSON.stringify({ api_address: apiSigner.address, private_key : apiSigner.privateKey},null,2));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});