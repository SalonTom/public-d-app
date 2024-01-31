const { ethers } = require("hardhat");
const path = require("path");

async function main() {
  const projectTokenFactory = await ethers.deployContract("ProjectTokenFactory");

  await projectTokenFactory.waitForDeployment();

  console.log(`Contract deployed to ${projectTokenFactory.target}`);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(projectTokenFactory);
}

function saveFrontendFiles(projectTokenFactory) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "shared_data").replace('\\', '/');

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