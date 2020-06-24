import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from '@reach/router'

import 'bulma/css/bulma.css'
import Navbar from './components/navbar'

const App = () => (
  <div className="container">
    <Navbar />
  </div>
)

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.querySelector('#app')
  )
})
