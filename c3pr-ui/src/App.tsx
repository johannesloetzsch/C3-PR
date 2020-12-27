import React from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'
import { Link, Router } from '@reach/router'
import { debug } from './conf'
import './app.css'

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic'])

function Navbar() {
  return (
    <nav hidden={!debug}>
      <Link to="/">Auto</Link>
      <Link to="/ui_allocation">Allocation</Link>
      <Link to="/ui_control_qr">Control+QR</Link>
      {/* <Link to="/dynamic">Dynamic</Link> */}
    </nav>
  )
}

function App() {
  return (
    <Root>
      <Navbar />
      <div className="content">
        <React.Suspense fallback={<em>Loading...</em>}>
          <Router>
            {/* <Dynamic path="dynamic" /> */}
            <Routes path="*" />
          </Router>
        </React.Suspense>
      </div>
    </Root>
  )
}

export default App
