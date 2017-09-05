import rest from "restling"


export default async function({ backend }) {
  const response = await rest.get(
    `http://${backend}/experiments`
  )
  return response.data
}
