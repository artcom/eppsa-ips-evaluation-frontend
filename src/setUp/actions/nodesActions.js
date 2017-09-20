import rest from "restling"


export async function getNodes({ backend }) {
  try {
    const response = await rest.get(
      `http://${backend}/nodes`
    )
    return response.data
  } catch (error) {
    return error
  }
}

export async function setNode({ backend, node }) {
  try {
    const response = await rest.post(
      `http://${backend}/nodes`,
      { data: node }
    )
    return response.data
  } catch (error) {
    return error
  }
}

export async function deleteNode({ backend, node }) {
  const nodeName = node.name
  try {
    const response = await rest.del(
      `http://${backend}/nodes/${nodeName}`
    )
    return response.data
  } catch (error) {
    return error
  }
}
