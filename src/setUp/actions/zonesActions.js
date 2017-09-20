import rest from "restling"


export async function getZones({ backend }) {
  const response = await rest.get(
    `http://${backend}/zones`
  )
  return response.data
}

export async function setZone({ backend, zone }) {
  const response = await rest.post(
    `http://${backend}/zones`,
    { data: zone }
  )
  return response.data
}

export async function deleteZone({ backend, zone }) {
  const zoneName = zone.name
  try {
    const response = await rest.del(
      `http://${backend}/zones/${zoneName}`
    )
    return response.data
  } catch (error) {
    return error
  }
}
