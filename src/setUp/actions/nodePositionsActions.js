import rest from "restling"


export async function getNodePositions({ backend, experimentName }) {
  const response = await rest.get(
    `http://${backend}/${experimentName}/node-positions`
  )
  return processReceivedData(response.data)
}

export async function setNodePosition({ backend, experimentName, nodePosition }) {
  const response = await rest.post(
    `http://${backend}/${experimentName}/node-positions`,
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
  return data.map(datum => ({
    localizedNodeName: datum.nodeName,
    pointName: datum.pointName,
    experimentName: datum.experimentName
  }))
}
