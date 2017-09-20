import rest from "restling"
import { keys, omit, pick, pickBy } from "lodash"


export async function getExperiments({ backend }) {
  try {
    const response = await rest.get(
      `http://${backend}/experiments`
    )
    return response.data
  } catch (error) {
    return error
  }
}

export async function setExperiment({ backend, experiment }) {
  try {
    const response = await rest.post(
      `http://${backend}/experiments`,
      { data: experiment }
    )
    return response.data
  } catch (error) {
    return error
  }
}

export async function deleteExperiment({ backend, experiment }) {
  const experimentName = experiment.name
  try {
    const response = await rest.del(
      `http://${backend}/experiments/${experimentName}`
    )
    return response.data
  } catch (error) {
    return error
  }
}

export async function runExperiment({ backend, experimentName, run }) {
  try {
    const response = await rest.post(
      `http://${backend}/experiments/${experimentName}/run`,
      { data: processParams(run) }
    )
    return response.data
  } catch (error) {
    return error
  }
}

export function processParams(params) {
  const supportedTypes = ["Quuppa", "GoIndoor"]
  const experimentTypes = keys(pickBy(pick(params, supportedTypes), type => type === true))
  const otherParams = omit(params, supportedTypes)
  return { experimentTypes, ...otherParams }
}
