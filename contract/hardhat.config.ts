import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-docgen";

const config: HardhatUserConfig = {
  solidity: "0.8.23",
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
  }
};

export default config;
