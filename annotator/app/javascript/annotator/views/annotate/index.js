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

        entities {
          id
          title
          color
        }
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
    dataset: loading || error ? null : data.text.dataset,
    entities: loading || error ? null : data.text.dataset.entities,
  }
}

const Annotate = ({ id }) => {
  const { loading, text, dataset, entities } = useText(id)
  const [value, setValue] = useState([])
  const [entityId, setEntityId] = useState('')

  const entity = entityId === ''
    ? {}
    : entities.find(e => e.id === parseInt(entityId))

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Link to={`/datasets/${dataset.id}`}>&laquo; {dataset.title}</Link>
      <h2 className="title">Annotate Text #{text.id}</h2>

      <select
        value={entityId}
        onChange={e => setEntityId(e.currentTarget.value)}
      >
        <option value="">- Choose Entity Type -</option>
        {entities.map(entity => (
          <option
            key={entity.id}
            value={entity.id.toString()}
          >
            {entity.title}
          </option>
        ))}
      </select>

      <TextAnnotator
        content={text.text}
        value={value}
        onChange={setValue}
        getSpan={span => ({
          ...span,
          tag: entity.title,
          color: entity.color,
        })}
      />
    </>
  )
}

export default Annotate
