import rest from "restling"


export async function getExperimentMetrics({ backend, experimentName }) {
  try {
    const response = await rest.get(
      `http://${backend}/experiments/${experimentName}/primary-metrics`
    )
    return response.data
  } catch (error) {
    return error
  }
}
