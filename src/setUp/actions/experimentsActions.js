import rest from "restling"


export async function getExperiments({ backend }) {
  const response = await rest.get(
    `http://${backend}/experiments`
  )
  return response.data
}

export async function setExperiment({ backend, experiment }) {
  try {
    return await rest.post(
      `http://${backend}/experiments`,
      { data: experiment }
    )
  } catch (error) {
    return error
  }
}

export async function deleteExperiment({ backend, experiment }) {
  const experimentName = experiment.name
  try {
    return await rest.del(
      `http://${backend}/experiments/${experimentName}`
    )
  } catch (error) {
    return error
  }
}

export async function runExperiment() {

}
