import React, { useState } from 'react'
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

const FILTERS = {
  'all': {
    title: 'All',
    call: (_) => true
  },
  'annotated': {
    title: 'Annotated',
    call: (text) => text.annotatedAt
  },
  'unannotated': {
    title: 'Not Annotated',
    call: (text) => !text.annotatedAt
  }
}

const Texts = ({ texts }) => {
  const [filter, setFilter] = useState('all')

  return (
    <>
      <div className="buttons">
        {Object.keys(FILTERS).map(f => (
          <button
            type="button"
            className={"button " + (f === filter ? 'is-primary is-active' : 'outlined')}
            onClick={() => setFilter(f)}
          >
            {FILTERS[f].title}
          </button>
        ))}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Summary</th>
            <th>Annotated</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {texts.filter(FILTERS[filter].call).map(text => (
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
    </>
  )
}

const AnnotatedPercentage = ({ texts }) => {
  const annotatedCount = texts.filter(text => text.annotatedAt).length
  const percentage = (annotatedCount / texts.length) * 100

  return (
    <article className="message is-info">
      <div className="message-body">
        {annotatedCount} of { texts.length } texts annotated ({percentage.toPrecision(4)}%).
      </div>
    </article>
  )
}

const Show = ({ id }) => {
  const { loading, dataset } = useDataset(id)

  return (
    <>
      <Link to="../">&laquo; All Datasets</Link>
      {loading && <div>Loading...</div>}
      {!loading && (
        <>
          <h2 className="title">{dataset.title}</h2>
          <AnnotatedPercentage texts={dataset.texts} />
          <Texts texts={dataset.texts} />
        </>
      )}
    </>
  )
}

export default Show
