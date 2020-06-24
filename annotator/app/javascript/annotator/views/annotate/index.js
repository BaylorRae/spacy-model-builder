import React, { useState } from 'react'
import { Link } from '@reach/router'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import { TextAnnotator } from 'react-text-annotate'

const TEXT = gql`
  query ($id: Int!) {
    text(id: $id) {
      id
      text
      
      dataset {
        id
        title
      }
    }
  }
`

function useText(id) {
  const { loading, error, data } = useQuery(
    TEXT,
    {
      variables: {id: parseInt(id)}
    }
  )

  return {
    loading,
    error,
    text: loading || error ? null : data.text,
    dataset: loading || error ? null : data.text.dataset
  }
}

const Annotate = ({ id }) => {
  const { loading, text, dataset } = useText(id)
  const [state, setState] = useState({
    value: [],
    tag: ''
  })

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Link to={`/datasets/${dataset.id}`}>&laquo; {dataset.title}</Link>
      <h2 className="title">Annotate Text #{text.id}</h2>
      <TextAnnotator
        content={text.text}
        value={state.value}
        onChange={value => setState({...state, value})}
      />
    </>
  )
}

export default Annotate
