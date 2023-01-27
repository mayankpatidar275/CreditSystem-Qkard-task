const hre = require("hardhat");

async function main() {
  const CreditInformation = await hre.ethers.getContractFactory("CreditInformation");
  const creditInformation = await CreditInformation.deploy();

  await creditInformation.deployed();

  console.log("Library deployed to:", creditInformation.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



// Library deployed to: 