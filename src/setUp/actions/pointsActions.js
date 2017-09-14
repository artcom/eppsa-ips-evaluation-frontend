import rest from "restling"


export async function getPoints({ backend }) {
  const response = await rest.get(
    `http://${backend}/points`
  )
  return processReceivedData(response.data)
}

export async function setPoint({ backend, point }) {
  const response = await rest.post(
    `http://${backend}/points`,
    { data: processSendData(point) }
  )
  return response.data
}

export function processReceivedData(data) {
  return data.map(datum => ({
    name: datum.name,
    X: datum.trueCoordinateX,
    Y: datum.trueCoordinateY,
    Z: datum.trueCoordinateZ
  }))
}

export function processSendData(data) {
  return data.map(datum => ({
    name: datum.name,
    trueCoordinateX: datum.X,
    trueCoordinateY: datum.Y,
    trueCoordinateZ: datum.Z
  }))
}
