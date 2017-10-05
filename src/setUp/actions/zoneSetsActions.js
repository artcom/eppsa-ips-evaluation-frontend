import rest from "restling"


export async function getZoneSets({ backend }) {
  try {
    const response = await rest.get(
      `http://${backend}/zone-sets`
    )
    return response.data
  } catch (error) {
    return error
  }
}

export async function setZoneSet({ backend, zoneSet }) {
  try {
    const response = await rest.post(
      `http://${backend}/zone-sets`,
      { data: zoneSet }
    )
    return response.data
  } catch (error) {
    return error
  }
}

export async function deleteZoneSet({ backend, zoneSet }) {
  const zoneSetName = zoneSet.name
  try {
    const response = await rest.del(
      `http://${backend}/zone-sets/${zoneSetName}`
    )
    return response.data
  } catch (error) {
    return error
  }
}
