const WALLET_PLATFORM_NODE_URL = "http://localhost:3001";
const MY_NODE_URL = "http://localhost:3002";

function getPortFromUrl(nodeUrl) {
  return (parseInt(nodeUrl.split(":")[2]) - 3000).toString();
}

export async function getNodesConnectedOnNetwork() {
  try {
    const response = await fetch(`http://localhost:3000/getNodes`);

    const result = await response.json();
    return result.peers || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getBlockchain(nodeUrl) {
  try {
    const nodePort = getPortFromUrl(nodeUrl);

    const response = await fetch(`http://localhost:${nodePort}/blockchain`);

    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getNodesInfo(nodeUrl) {
  try {
    const nodePort = getPortFromUrl(nodeUrl);
    const response = await fetch(`http://localhost:${nodePort}/infos`);

    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAmmountWallet(walletId) {
  try {
    const response = await fetch(
      `${WALLET_PLATFORM_NODE_URL}/wallet/${walletId}`
    );

    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createNewTransaction(walletFrom, walletTo, amount, keys) {
  try {
    const response = await fetch(`${WALLET_PLATFORM_NODE_URL}/addBlock`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletFrom,
        walletTo,
        amount,
        keys,
      }),
    });

    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
