import rest from "restling"


export async function getExperiments({ backend }) {
  const response = await rest.get(
    `http://${backend}/experiments`
  )
  return response.data
}

export async function setExperiment({ backend, experimentName }) {
  try {
    return await rest.post(
      `http://${backend}/experiments`,
      { data: { name: experimentName } }
    )
  } catch (error) {
    return error
  }
}

export async function deleteExperiment({ backend, experimentName }) {
  try {
    return await rest.del(
      `http://${backend}/experiments/${experimentName}`
    )
  } catch (error) {
    return error
  }
}

