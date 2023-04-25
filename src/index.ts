import { Contract, providers, ethers } from "ethers";
import syncWriteFile from "./file";
import { aggregratorV3Abi } from "./consts";

const CHAIN_ID = 1; // chain id
const FEED_TO_CHECK = "0x694AA1769357215DE4FAC081bf1f309aDC325306"; // address
const TIME_TO_CHECK_BACK = 123; // value in seconds
const filterTopic =
  "0x0109fc6f55cf40689f02fbaad7af7fe7bbac8a3d2186600afc7d3e10cac60271";
export const networkNames: Record<number, string> = {
  1: "homestead",
  5: "goerli",
  137: "matic",
  42161: "arbitrum",
  10: "optimism",
  11155111: "sepolia",
};

const alchemyProvider = new ethers.providers.JsonRpcProvider(
  "https://eth-sepolia.g.alchemy.com/v2/BJAanL3lj16WbI6BaI8mA5xR49pWQpDy"
);

//'https://eth-mainnet.g.alchemy.com/v2/U61ANOKHUoWPFReMr30dSTBMZIMwl6T2'
const chainLinkAggregratorInstance = new Contract(
  FEED_TO_CHECK,
  aggregratorV3Abi,
  alchemyProvider
);

//try to get the roundId

// const logs = await  alchemyProvider.getLogs ({
//   address: FEED_TO_CHECK,
//   topics: [filterTopic]
// })

// let res = await getPastLogs({
//   address: aggreagatorBeingSearchedAddress,
//   topics: [filterTopic]
// })

function calcRoundId() {
  const phaseId = BigInt("4");
  const aggregatorRoundId = BigInt("1");

  const roundId = (phaseId << BigInt("64")) | aggregatorRoundId; // returns 73786976294838206465n
  console.log(roundId);

  return roundId;
}

async function getLatestRound(){
  const call = await chainLinkAggregratorInstance.latestRoundData();
  console.log(ethers.BigNumber.from(call.roundId).toString());
  console.log(ethers.BigNumber.from(call.answer).toString());
  console.log(ethers.BigNumber.from(call.startedAt).toString());
  console.log(ethers.BigNumber.from(call.updatedAt).toString());
  console.log(ethers.BigNumber.from(call.answeredInRound).toString());
  
  return call.roundId;
}

async function getRoundData() {
  const call = await chainLinkAggregratorInstance.getRoundData(getLatestRound());
  console.log(call);
}

async function getversion() {
  const call = await chainLinkAggregratorInstance.version();
  console.log(ethers.BigNumber.from(call).toString());
}


