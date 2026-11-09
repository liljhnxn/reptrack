import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

const { ethers } = hre;

async function main() {
  console.log("----------------------------------------------------");
  console.log("Deploying RepTrack to Botchain Testnet (Chain ID: 968)...");
  console.log("----------------------------------------------------");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer available. Please check PRIVATE_KEY in .env.local");
  }

  console.log(`Deploying with account: ${deployer.address}`);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} BOT/BOHR`);

  const RepTrackFactory = await ethers.getContractFactory("RepTrack");
  console.log("Submitting deployment transaction...");
  const repTrack = await RepTrackFactory.deploy();
  await repTrack.waitForDeployment();

  const contractAddress = await repTrack.getAddress();
  console.log("\n====================================================");
  console.log(" RepTrack successfully deployed!");
  console.log(` Contract Address: ${contractAddress}`);
  console.log(` BohrScan Link: https://scan.bohr.life/address/${contractAddress}`);
  console.log("====================================================");

  // Automatically update .env.local
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf-8");
    if (envContent.includes("NEXT_PUBLIC_REPTRACK_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_REPTRACK_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_REPTRACK_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_REPTRACK_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    fs.writeFileSync(envPath, envContent);
    console.log(`Updated NEXT_PUBLIC_REPTRACK_CONTRACT_ADDRESS in .env.local`);
  }

  // Also update fallback address in lib/contract.ts
  const contractLibPath = path.join(process.cwd(), "lib", "contract.ts");
  if (fs.existsSync(contractLibPath)) {
    let libContent = fs.readFileSync(contractLibPath, "utf-8");
    libContent = libContent.replace(
      /process\.env\.NEXT_PUBLIC_REPTRACK_CONTRACT_ADDRESS \|\|\n\s*"0x[a-fA-F0-9]{40}"/,
      `process.env.NEXT_PUBLIC_REPTRACK_CONTRACT_ADDRESS ||\n  "${contractAddress}"`
    );
    fs.writeFileSync(contractLibPath, libContent);
    console.log(`Updated fallback address in lib/contract.ts`);
  }
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
