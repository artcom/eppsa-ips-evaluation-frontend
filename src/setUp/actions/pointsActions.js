import rest from "restling"


export async function getPoints({ backend }) {
  const response = await rest.get(
    `http://${backend}/points`
  )
  return response.data
}

export async function setPoint({ backend, point }) {
  const response = await rest.post(
    `http://${backend}/points`,
    { data: point }
  )
  return response.data
}
