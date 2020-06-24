import React, { useState } from 'react'
import { Link, navigate } from '@reach/router'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'
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
const ADD_ANNOTATIONS = gql`
  mutation ($id: Int!, $annotations: [AnnotationInput!]!) {
    textAddAnnotation(id: $id, annotations: $annotations) {
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
    dataset: loading || error ? null : data.text.dataset,
    entities: loading || error ? null : data.text.dataset.entities,
  }
}

const Annotate = ({ id }) => {
  const { loading, text, dataset, entities } = useText(id)
  const [value, setValue] = useState([])
  const [entityId, setEntityId] = useState('')
  const [addAnnotations] = useMutation(ADD_ANNOTATIONS)

  const entity = entityId === ''
    ? {}
    : entities.find(e => e.id === parseInt(entityId))

  function buildGraphQLInput() {
    return {
      id: parseInt(id),
      annotations: value.map(annotation => ({
        entityId: entities.find(e => e.title === annotation.tag).id,
        selectionStart: annotation.start,
        selectionEnd: annotation.end
      }))
    }
  }

  function saveAnnotations() {
    addAnnotations({
      variables: buildGraphQLInput()
    }).then(() => navigate(`/datasets/${dataset.id}`))
  }

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

      <button
        type="button"
        onClick={saveAnnotations}
        className="button is-primary"
      >
        Save Annotations
      </button>
    </>
  )
}

export default Annotate
