import { Block } from "../../commons/block";
import { Transaction } from "../../commons/transaction";
import {
  BROKER_GET_NODES_INFO_URL,
  WALLET_PLATFORM_GET_BLOCKCHAIN_URL,
  WALLET_PLATFORM_GET_AMOUNT_WALLET_URL,
  WALLET_PLATFORM_ADD_TRANSACTION_URL,
  HTTP_URL_BASE
} from "../../constants/urls";

function getPortFromUrl(nodeUrl: string): string {
  return (parseInt(nodeUrl.split(":")[2]) - 3000).toString();
}

export async function getNodesConnectedOnNetwork(): Promise<string[] | null> {
  try {
    const response = await fetch(BROKER_GET_NODES_INFO_URL);

    const result = await response.json();
    return result.peers || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getBlockchain(): Promise<Block[]> {
  try {
    const response = await fetch(WALLET_PLATFORM_GET_BLOCKCHAIN_URL);

    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getNodesInfo(nodeUrl: string): Promise<object | null> {
  try {
    const nodePort = getPortFromUrl(nodeUrl);
    const response = await fetch(`${HTTP_URL_BASE}:${nodePort}/infos`);

    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAmmountWallet(
  walletAddress: string
): Promise<number | null> {
  try {
    const response = await fetch(
      `${WALLET_PLATFORM_GET_AMOUNT_WALLET_URL}/${walletAddress}`
    );

    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createNewTransaction(transaction: Transaction) {
  try {
    const response = await fetch(WALLET_PLATFORM_ADD_TRANSACTION_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ transaction })
    });

    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function asyncForEach(array: string[] | null, callback: Function) {
  if (!array) return;

  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
