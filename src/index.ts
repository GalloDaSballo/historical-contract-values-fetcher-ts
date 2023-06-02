import * as dotenv from "dotenv";
import { Network, Alchemy } from "alchemy-sdk";
import syncWriteFile from "./file";

dotenv.config();

const CONTRACT_ADDRESS = "0xBA485b556399123261a5F9c95d413B4f93107407";
const CHAIN_ID = 1;
const BLOCKS_IN_THE_PAST = 1; // 60 * 60 * 24 / 12
const START_BLOCK = 17381949;
const SIGNATURE = "0x77c7b8fc"; // 77c7b8fc  =>  getPricePerFullShare() // Use this: https://piyolab.github.io/playground/ethereum/getEncodedFunctionSignature/
// Or this: https://openchain.xyz/signatures

// Optional config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.ALCHEMY_KEY, // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);

interface Reads {
  block: number;
  value: number;
}

const makeRequest = async (blockId) => {
  // Make a sample eth_call
  try {
    const res = await alchemy.core.call(
      {
        to: CONTRACT_ADDRESS,
        gasPrice: "0x9184e72a000",
        data: SIGNATURE,
      },
      blockId
    );
    console.log("res", res);
    return res;
  } catch (err) {
    return -1;
  }
};

const READS_ARRAY = [];

async function getAllData() {
  let currentBlock = START_BLOCK - 1;
  const endBlock = currentBlock - BLOCKS_IN_THE_PAST;
  while (currentBlock > endBlock) {
    const currentBlocks = [];
    const ROUND_PER_CALL = 50;

    console.log("ROUND_PER_CALL", ROUND_PER_CALL);
    console.log("roundId", currentBlock);
    for (let i = currentBlock; i > currentBlock - ROUND_PER_CALL; i--) {
      currentBlocks.push(i);
    }

    console.log("currentBlocks", currentBlocks);
    const res = await Promise.all(
      await currentBlocks.map(async (block) => {
        return await { value: await makeRequest(block), block };
      })
    );

    for (const entry of res) {
      // @ts-ignore
      entry.value = parseInt(entry.value, 16);
      READS_ARRAY.push(entry);
    }

    currentBlock -= ROUND_PER_CALL;
  }

  // write to file
  const data = READS_ARRAY;
  const jsonData = JSON.stringify(data);

  syncWriteFile(`${CONTRACT_ADDRESS}.json`, `${CHAIN_ID}`, jsonData);
}

getAllData();
