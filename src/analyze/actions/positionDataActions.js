import rest from "restling"


export async function getPositionData({ backend, experimentName }) {
  try {
    const response = await rest.get(
      `http://${backend}/experiments/${experimentName}/position-data`
    )
    return response.data
  } catch (error) {
    return error
  }
}
