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

export async function getBlockchainFrom(nodeUrl) {
  try {
    const nodePort = getPortFromUrl(nodeUrl);

    const response = await fetch(
      `http://localhost:${nodePort}/blockchain`
    );

    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getNodesInfoFrom(nodeUrl) {
  try {
    const nodePort = getPortFromUrl(nodeUrl);
    const response = await fetch(
      `http://localhost:${nodePort}/infos`
    );

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
