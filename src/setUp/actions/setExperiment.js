import rest from "restling"


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
