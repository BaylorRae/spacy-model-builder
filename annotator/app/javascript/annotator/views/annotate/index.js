import React, { useState, useEffect } from 'react'
import { Link, navigate } from '@reach/router'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { TextAnnotator } from 'react-text-annotate'

const TEXT = gql`
  query ($id: Int!) {
    text(id: $id) {
      id
      text

      annotations {
        id
        selectionStart
        selectionEnd

        entity {
          id
          title
        }
      }
      
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

  useEffect(() => {
    if (loading) return

    if (entityId === '') {
      setEntityId(entities[0].id)
    }

    setValue(text.annotations.map(annotation => ({
      start: annotation.selectionStart,
      end: annotation.selectionEnd,
      tag: entities.find(e => e.id === annotation.entity.id).title,
      color: entities.find(e => e.id === annotation.entity.id).color
    })))
  }, [loading])

  useEffect(() => {
    function handleKeyDown(e) {
      if (/[1-9]/.test(e.key)) {
        e.preventDefault()
        setEntityId(parseInt(e.key))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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

      <div className="buttons">
        {entities.map((entity, i) => (
          <button
            key={entity.id}
            className={"button " + (entity.id === entityId ? 'is-primary is-active' : 'outlined')}
            onClick={() => setEntityId(entity.id)}
            value={entity.id.toString()}
          >
            <span className="tag mr-3">{i + 1}</span>
            {entity.title}
          </button>
        ))}
      </div>

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
