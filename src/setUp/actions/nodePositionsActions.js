import rest from "restling"


export async function getNodePositions({ backend, experimentName }) {
  try {
    const response = await rest.get(
      `http://${backend}/experiments/${experimentName}/node-positions`
    )
    return processReceivedData(response.data)
  } catch (error) {
    return error
  }
}

export async function setNodePosition({ backend, experimentName, nodePosition }) {
  try {
    const response = await rest.post(
      `http://${backend}/experiments/${experimentName}/node-positions`,
      { data: processSendData(nodePosition) }
    )
    return response.data
  } catch (error) {
    return error
  }
}

export async function deleteNodePosition({ backend, experimentName, nodePosition }) {
  const nodeName = nodePosition.nodeName
  try {
    const response = await rest.del(
      `http://${backend}/experiments/${experimentName}/node-positions/${nodeName}`
    )
    return response.data
  } catch (error) {
    return error
  }
}

export function processReceivedData(data) {
  return data.map(datum => ({
    nodeName: datum.localizedNodeName,
    pointName: datum.pointName,
    experimentName: datum.experimentName
  }))
}

export function processSendData(data) {
  return {
    localizedNodeName: data.nodeName,
    pointName: data.pointName,
    experimentName: data.experimentName
  }
}
