import { Block } from "../../commons/block";

const WALLET_PLATFORM_NODE_URL = "http://localhost:3001";

function getPortFromUrl(nodeUrl: string): string {
  return (parseInt(nodeUrl.split(":")[2]) - 3000).toString();
}

export async function getNodesConnectedOnNetwork(): Promise<string[] | null> {
  try {
    const response = await fetch(`http://localhost:3000/getNodes`);

    const result = await response.json();
    return result.peers || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getBlockchain(nodeUrl: string): Promise<Block[]> {
  try {
    const nodePort = getPortFromUrl(nodeUrl);

    const response = await fetch(`http://localhost:${nodePort}/blockchain`);

    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getNodesInfo(nodeUrl: string): Promise<object | null> {
  try {
    const nodePort = getPortFromUrl(nodeUrl);
    const response = await fetch(`http://localhost:${nodePort}/infos`);

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
      `${WALLET_PLATFORM_NODE_URL}/wallet/${walletAddress}`
    );

    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createNewTransaction(
  walletFrom: string,
  walletTo: string,
  amount: number
) {
  try {
    const response = await fetch(`${WALLET_PLATFORM_NODE_URL}/addBlock`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        walletFrom,
        walletTo,
        amount
      })
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
