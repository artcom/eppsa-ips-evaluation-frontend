import rest from "restling"


export async function getNodes({ backend }) {
  const response = await rest.get(
    `http://${backend}/nodes`
  )
  return response.data
}

export async function setNode({ backend, node }) {
  const response = await rest.post(
    `http://${backend}/nodes`,
    { data: node }
  )
  return response.data
}
