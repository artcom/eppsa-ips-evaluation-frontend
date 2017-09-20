import rest from "restling"


export async function getZones({ backend }) {
  try {
    const response = await rest.get(
      `http://${backend}/zones`
    )
    return response.data
  } catch (error) {
    return error
  }
}

export async function setZone({ backend, zone }) {
  try {
    const response = await rest.post(
      `http://${backend}/zones`,
      { data: zone }
    )
    return response.data
  } catch (error) {
    return error
  }
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
