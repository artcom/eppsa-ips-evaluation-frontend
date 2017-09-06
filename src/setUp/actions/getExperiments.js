import rest from "restling"


export async function getExperiments({ backend }) {
  const response = await rest.get(
    `http://${backend}/experiments`
  )
  return response.data
}
