import rest from "restling"


export async function deleteExperiment({ backend, experimentName }) {
  try {
    return await rest.del(
      `http://${backend}/experiments/${experimentName}`
    )
  } catch (error) {
    return error
  }
}
