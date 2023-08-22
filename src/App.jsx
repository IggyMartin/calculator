import React, { useState } from 'react'
import './App.css'
import Numbers from './numbers/Numbers'

function App() {
  const [math, setMath] = useState("")

  return (
    <div className='container'>
      <div className='firstRow'>
        <p>{math}</p>
        <p id='display'>result here</p>
      </div>
      <div className='mathSymbols'>
        <button id='clear'>AC</button>
        <button id='divide'>/</button>
        <button id='multiply'>X</button>
      </div>
      <div className='numbers'>
        <Numbers />
      </div>
      <div className='mathSymbols2'>
        <button id='add'>+</button>
        <button id='subtract'>-</button>
        <button id='equals'>=</button>
      </div>
    </div>
  )
}

export default App
