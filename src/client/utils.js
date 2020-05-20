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

export async function getNodesInfo(nodeUrl) {
  try {
    const nodePort = parseInt(nodeUrl.split(":")[2]) - 3000;
    const response = await fetch(
      `http://localhost:${nodePort.toString()}/infos`
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
