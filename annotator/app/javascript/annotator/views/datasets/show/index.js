import React from 'react'
import { Link } from '@reach/router'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

const DATASET = gql`
  query ($id: Int!) {
    dataset(id: $id) {
      id
      title
      
      texts {
        id
        text
        annotatedAt
      }
    }
  }
`

function useDataset(id) {
  const { loading, error, data } = useQuery(
    DATASET,
    {
      variables: {id: parseInt(id)}
    }
  )

  return {
    loading,
    error,
    dataset: loading || error ? null : data.dataset
  }
}

const Texts = ({ texts }) => (
  <table className="table">
    <thead>
      <tr>
        <th>Summary</th>
        <th>Annotated</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {texts.map(text => (
        <tr key={text.id}>
          <td>{text.text.substr(0, 50)}...</td>
          <td>{text.annotatedAt ? 'Yes' : 'No'}</td>
          <td>
            <Link to={`/annotate/${text.id}`}>Annotate &raquo;</Link>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)

const Show = ({ id }) => {
  const { loading, dataset } = useDataset(id)

  return (
    <>
      <Link to="../">&laquo; All Datasets</Link>
      {loading && <div>Loading...</div>}
      {!loading && (
        <>
          <h2 className="title">{dataset.title}</h2>
          <div className="alert"><strong>Add annotation state</strong></div>
          <Texts texts={dataset.texts} />
        </>
      )}
    </>
  )
}

export default Show
