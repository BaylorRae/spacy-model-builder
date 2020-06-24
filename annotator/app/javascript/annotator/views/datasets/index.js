import React from 'react'
import { Router } from '@reach/router'

import List from './list'

const Datasets = () => (
  <Router>
    <List path="/" />
  </Router>
)

export default Datasets
