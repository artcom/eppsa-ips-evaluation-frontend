import React from "react"


export default function DataTable({ headers, data }) {
  return (
    <table>
      <tr>
        {
          headers.map((header, i) => <th key={ i }>{ header }</th>)
        }
      </tr>
      {
        data && data.map((datum, i) => <tr key={ i }>
          {
            datum.map((d, i) => <td key={ i }>{ d }</td>)
          }
        </tr>)
      }
    </table>
  )
}
