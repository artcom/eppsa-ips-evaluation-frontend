import React from "react"
import Button from "./button"


export default function DataTable({ headers, data, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
        {
          headers.map((header, i) => <th key={ i }>{ header }</th>)
        }
        </tr>
      </thead>
      <tbody>
      {
        data && data.map((datum, i) => <tr key={ i }>
          {
            datum.map((d, i) => <td key={ i }>{ d }</td>)
          }
          <td><Button onClick={ () => onDelete(datum) }>Delete</Button></td>
        </tr>)
      }
      </tbody>
    </table>
  )
}
