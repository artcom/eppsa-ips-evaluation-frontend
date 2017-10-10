import { filter, find, mean } from "lodash"


export function positionData3D(data) {
  const points = [
    ["A", "B", "C", "D", "D"],
    ["E", "F", "G", "H", "H"],
    ["I", "J", "K", "L", "R"],
    ["M", "N", "O", "P", "Q"]
  ]
  const x = points
    .map(row =>
      row.map(point => find(data, datum => datum.pointName === point).point.trueCoordinateX)
    )
  const y = points
    .map(row =>
      row.map(point => find(data, datum => datum.pointName === point).point.trueCoordinateY)
    )
  const z = points
    .map(row =>
      row.map(point =>
        mean(
          filter(data, datum => datum.pointName === point)
            .map(position => position.localizationError2d)
        )
      )
    )
  return { x, y, z }
}
