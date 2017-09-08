import rest from "restling"


export async function getPoints({ backend }) {
  const response = await rest.get(
    `http://${backend}/points`
  )
  return response.data
}
