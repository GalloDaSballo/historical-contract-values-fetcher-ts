import { Contract, providers, ethers, BigNumber } from "ethers";
import syncWriteFile from "./file";
import { aggregratorV3Abi } from "./consts";
import { ChainLinkReturnData } from "./types";
import * as dotenv from 'dotenv' 
dotenv.config()

const CHAIN_ID = 1; // chain id
const FEED_TO_CHECK = "0x72AFAECF99C9d9C8215fF44C77B94B99C28741e8"; // address
const TIME_TO_CHECK_BACK_TO = 10000; // value in seconds

const alchemyProvider = new ethers.providers.JsonRpcProvider(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
);

const chainLinkAggregratorInstance = new Contract(
  FEED_TO_CHECK,
  aggregratorV3Abi,
  alchemyProvider
);



async function getLatestRoundData() {
  const call = await chainLinkAggregratorInstance.latestRoundData();
  const roundId = call.roundId;
  const timeOfUpdate = call.updatedAt;

  return { roundId, timeOfUpdate };
}

async function getRoundData(round: BigInt) {
  const call = await chainLinkAggregratorInstance.getRoundData(round);
  return call;
}

async function getversion() {
  const call = await chainLinkAggregratorInstance.version();
  console.log(ethers.BigNumber.from(call).toString());
}

const PRICEARRAY = [];

async function getAllData() {
  var { roundId, timeOfUpdate } = await getLatestRoundData();
  console.log(ethers.BigNumber.from(timeOfUpdate).toString());

  var currentPriceDataReturnedTime = Number(
    ethers.BigNumber.from(timeOfUpdate).toString()
  );
  console.log("currentPriceDataReturnedTime", currentPriceDataReturnedTime);

  while (
    currentPriceDataReturnedTime >
    Number(ethers.BigNumber.from(timeOfUpdate).toString()) -
      TIME_TO_CHECK_BACK_TO
  ) {
    var roundData = await getRoundData(roundId);
    currentPriceDataReturnedTime = roundData.updatedAt;

    const formattedRoundDataObject: ChainLinkReturnData = {
      roundId: ethers.BigNumber.from(roundData.roundId).toString(),
      answer: ethers.BigNumber.from(roundData.answer).toString(),
      startedAt: ethers.BigNumber.from(roundData.startedAt).toString(),
      updatedAt: ethers.BigNumber.from(roundData.updatedAt).toString(),
      answeredInRound: ethers.BigNumber.from(
        roundData.answeredInRound
      ).toString(),
    };

    PRICEARRAY.push(formattedRoundDataObject);
    roundId = BigInt(roundId) - BigInt("1");
    console.log(roundId);
  }

  //write to file
  const data = { data: PRICEARRAY };
  const jsonData = JSON.stringify(data);

  syncWriteFile("priceArray.json", jsonData);
}

console.log("get all data", getAllData());
