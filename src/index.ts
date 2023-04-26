import { Contract, ethers } from "ethers";
import syncWriteFile from "./file";
import { AGGREGRATOR_V3_ABI } from "./abis";
import { ChainLinkReturnData } from "./types";
import * as dotenv from "dotenv";
dotenv.config();

const CHAIN_ID = 1; // chain id
const FEED_TO_CHECK = "0x72AFAECF99C9d9C8215fF44C77B94B99C28741e8"; // address
const TIME_TO_CHECK_BACK_TO = 100; // value in seconds, FOR EXAMPLE 100 SECONDS BACK IN TIME 

const RPC_URLS: Record<number, string> = {
  1: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ETH_MAINNET_ALCHEMY_KEY}`,
  5: `https://eth-goerli.g.alchemy.com/v2/${process.env.GOERLI_ALCHEMY_KEY}`,
  137: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.POLYGON_MAINNET_ALCHEMY_KEY}`,
  42161: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ARBITRUM_MAINNET_ALCHEMY_KEY}`,
  10: `https://opt-mainnet.g.alchemy.com/v2/${process.env.OPTIMISM_MAINNET_ALCHEMY_KEY}`,
  11155111: `https://eth-sepolia.g.alchemy.com/v2/${process.env.SEPOLIA_ALCHEMY_KEY}`,
};
const ALCHEMY_PROVIDER = new ethers.providers.JsonRpcProvider(
  RPC_URLS[CHAIN_ID]
);
const CHAIN_LINK_AGGREGRATOR_INSTANCE = new Contract(
  FEED_TO_CHECK,
  AGGREGRATOR_V3_ABI,
  ALCHEMY_PROVIDER
);

const PRICE_ARRAY = [];

async function getLatestRoundData() {
  const call = await CHAIN_LINK_AGGREGRATOR_INSTANCE.latestRoundData();
  const roundId = call.roundId;
  const timeOfUpdate = call.updatedAt;

  return { roundId, timeOfUpdate };
}

async function getRoundData(round: BigInt) {
  const call = await CHAIN_LINK_AGGREGRATOR_INSTANCE.getRoundData(round);
  return call;
}

async function getVersion() {
  const call = await CHAIN_LINK_AGGREGRATOR_INSTANCE.version();
  console.log(ethers.BigNumber.from(call).toString());
  return call;
}

async function getAllData() {
  var { roundId, timeOfUpdate } = await getLatestRoundData();
  var currentPriceDataReturnedTime = Number(
    ethers.BigNumber.from(timeOfUpdate).toString()
  );
  const timestampToStopAt =
    Number(ethers.BigNumber.from(timeOfUpdate).toString()) -
    TIME_TO_CHECK_BACK_TO;

  while (currentPriceDataReturnedTime > timestampToStopAt) {
    var roundData = await getRoundData(roundId);
    currentPriceDataReturnedTime = Number(
      ethers.BigNumber.from(roundData.updatedAt).toString()
    );

    if (currentPriceDataReturnedTime < timestampToStopAt) break;

    const formattedRoundDataObject: ChainLinkReturnData = {
      roundId: ethers.BigNumber.from(roundData.roundId).toString(),
      answer: ethers.BigNumber.from(roundData.answer).toString(),
      startedAt: ethers.BigNumber.from(roundData.startedAt).toString(),
      updatedAt: ethers.BigNumber.from(roundData.updatedAt).toString(),
      answeredInRound: ethers.BigNumber.from(
        roundData.answeredInRound
      ).toString(),
    };

    PRICE_ARRAY.push(formattedRoundDataObject);
    //REDUCE THE ROUND NUMBER
    roundId = BigInt(roundId) - BigInt("1");
  }

  //write to file
  const data = { data: PRICE_ARRAY };
  const jsonData = JSON.stringify(data);

  syncWriteFile("priceArray.json", jsonData);
}

getAllData();
