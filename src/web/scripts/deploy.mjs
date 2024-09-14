import fs from "fs";
import * as esbuild from "esbuild";
import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";
import { WarpFactory } from "warp-contracts";
import { replaceInFile } from "replace-in-file"; // Correct import
import path from "path";

(async () => {
  // *store with name 'wallet.json' in root directory of project if needed
  const walletPath = process.argv[2] ?? "wallet.json";

  // Initiating a new warp instance for mainnet
  const warp = WarpFactory.forMainnet().use(new DeployPlugin());

  // Read private key file
  const key = JSON.parse(fs.readFileSync(walletPath).toString());

  // Get absolute path for project directory
  const __dirname = path.resolve();

  await esbuild.build({
    entryPoints: [
      `src/contracts/contract.${
        fs.existsSync("src/contracts/contract.ts") ? "ts" : "js"
      }`,
    ],
    bundle: true,
    outfile: "contracts-dist/contract.js",
    format: "esm",
  });

  const files = [`./contracts-dist/contract.js`];

  // Use asynchronous replaceInFile
  try {
    const results = await replaceInFile({
      files: files,
      from: [/async function handle/g, /export {\n {2}handle\n};\n/g],
      to: ["export async function handle", ""],
      countMatches: true,
    });
    console.log("Replacement results:", results);
  } catch (error) {
    console.error("Error occurred during replacement:", error);
  }

  // Read contract source logic from 'contract.js' and encode it
  const contractSource = fs.readFileSync(
    path.join(__dirname, "contracts-dist/contract.js"),
    "utf-8"
  );

  // Create new contract source
  const newSource = await warp.createSource(
    { src: contractSource },
    new ArweaveSigner(key)
  );
  const newSrcId = await warp.saveSource(newSource);

  // Write new contract source's transaction ID to a new file
  fs.writeFileSync(
    path.join(__dirname, "src", "contracts", "contractData.json"),
    JSON.stringify({ contractId: newSrcId })
  );

  // Log the new contract source's transaction ID
  console.log("New Source Contract Id: ", newSrcId);
})();
