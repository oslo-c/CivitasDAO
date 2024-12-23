import { ethers } from "ethers";

const INFURA_ID = "e6bba52c72914ceb8eede9b983bc9ed6";
const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`);
provider._getConnection().timeout = 30000;

const abi = [
    "function totalSupply() external view returns (uint256)",
];
const dai_address = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const dai_contract = new ethers.Contract(dai_address, abi, provider);

let totalSupply = '[FETCHING DATA]';

export async function updateTotalSupply(callback) {
    totalSupply = await dai_contract.totalSupply();
    const formattedSupply = totalSupply.toString();
    if (callback) {
        callback(formattedSupply);
    }
    return '[Total Supply: ' + formattedSupply + ']';
}

export function getTotalSupply() {
    return totalSupply;
}
