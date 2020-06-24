import React from 'react'
import { Router } from '@reach/router'

import List from './list'
import Show from './show'

const Datasets = () => (
  <Router>
    <Show path="/:id" />
    <List path="/" />
  </Router>
)

export default Datasets
