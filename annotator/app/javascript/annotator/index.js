import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from '@reach/router'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'

import 'bulma/css/bulma.css'
import Navbar from './components/navbar'

import Annotate from './views/annotate'
import Datasets from './views/datasets'

const client = new ApolloClient()

const App = () => (
  <ApolloProvider client={client}>
    <div className="container">
      <Navbar />

      <Router>
        <Annotate path="/annotate/:id" />
        <Datasets path="/datasets/*" />
      </Router>
    </div>
  </ApolloProvider>
)

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.querySelector('#app')
  )
})
