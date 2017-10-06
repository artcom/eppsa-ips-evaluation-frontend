import rest from "restling"


export async function getZones({ backend, zoneSetName }) {
  try {
    const response = await rest.get(
      `http://${backend}/zone-sets/${zoneSetName}`
    )
    return response.data.zones
  } catch (error) {
    return error
  }
}

export async function setZone({ backend, zone, zoneSetName }) {
  try {
    await rest.post(
      `http://${backend}/zones`,
      { data: zone }
    )
  } catch (error) {
    return error
  }
  try {
    const response = await rest.post(
      `http://${backend}/zone-sets/${zoneSetName}`,
      { data: { zoneName: zone.name } }
    )
    return response.data
  } catch (error) {
    return error
  }
}

export async function deleteZone({ backend, zone, zoneSetName }) {
  let response
  const zoneName = zone.name
  try {
    response = await rest.del(
      `http://${backend}/zone-sets/${zoneSetName}/${zoneName}`
    )
  } catch (error) {
    return error
  }
  try {
    await rest.del(
      `http://${backend}/zones/${zoneName}`
    )
  } catch (error) {
    return error
  }
  return response.data
}
