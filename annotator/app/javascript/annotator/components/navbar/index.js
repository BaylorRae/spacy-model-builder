import React from 'react'
import { Link } from '@reach/router'

const Navbar = () => (
  <nav className="navbar py-3">
    <div className="navbar-brand">
      <Link className="navbar-item" to="/">Annotator</Link>
    </div>

    <div className="navbar-start">
      <Link className="navbar-item" to="/">Home</Link>
      <Link className="navbar-item" to="/datasets">Datasets</Link>
    </div>
  </nav>
)

export default Navbar
