import rest from "restling"


export default async function setExperiment({ backend, experimentName }) {
  try {
    await rest.post(
      `http://${backend}/experiments`,
      { data: { name: experimentName } }
    )
  } catch(error) {
    console.error(error)
  }
}
