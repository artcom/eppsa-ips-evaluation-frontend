import React from "react"


export default function DataTable({ headers }) {
  return (
    <table>
      <tr>
        {
          headers.map((header, i) => <th key={ i }>{ header }</th>)
        }
      </tr>
    </table>
  )
}
