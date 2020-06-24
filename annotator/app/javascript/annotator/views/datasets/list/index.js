import React from 'react'
import { Link } from '@reach/router'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

const ALL_DATASETS = gql`
  query {
    datasets {
      id
      title
    }
  }
`

function useDatasets() {
  const { loading, error, data } = useQuery(ALL_DATASETS)

  return {
    loading,
    error,
    datasets: loading || error ? [] : data.datasets
  }
}

const Items = ({ items }) => (
  <table className="table">
    <thead>
      <tr>
        <th>Title</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {items.map(dataset => (
        <tr key={dataset.id}>
          <td>{dataset.title}</td>
          <td>
            <Link to={dataset.id.toString()}>View &raquo;</Link>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)

const List = () => {
  const { loading, datasets } = useDatasets()

  return (
    <>
      <h2 className="title">All Datasets</h2>
      {loading && <div>Loading...</div>}
      {!loading && <Items items={datasets} />}
    </>
  )
}

export default List
