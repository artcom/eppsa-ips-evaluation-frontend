import rest from "restling"


export async function getNodePositions({ backend, experimentName }) {
  const response = await rest.get(
    `http://${backend}/experiments/${experimentName}/node-positions`
  )
  return processReceivedData(response.data)
}

export async function setNodePosition({ backend, experimentName, nodePosition }) {
  const response = await rest.post(
    `http://${backend}/experiments/${experimentName}/node-positions`,
    { data: processSendData(nodePosition) }
  )
  return response.data
}

export function processReceivedData(data) {
  return data.map(datum => ({
    nodeName: datum.localizedNodeName,
    pointName: datum.pointName,
    experimentName: datum.experimentName
  }))
}

export function processSendData(data) {
  console.error(data)
  return {
    localizedNodeName: data.nodeName,
    pointName: data.pointName,
    experimentName: data.experimentName
  }
}
