import React from 'react'
import './App.css'
import { Pan } from './pan/Pan';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="container-fluid">
        <Pan />
      </div>
    </div>
  )
}

export default App
