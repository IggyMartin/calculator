import React, { useState } from 'react'
import './App.css'
import Numbers from './numbers/Numbers'
import { all, evaluate, lsolve } from 'mathjs'

function App() {
  const [math, setMath] = useState("")
  const [mathOperation, setMathOperation] = useState(math)
  const [display, setDisplay] = useState("0")
  const [lastKey, setLastKey] = useState("")
  const [dot, setDot] = useState(true)
  const operators = '+-*/';

  const handleClear = () => {
    setMath("")
    setMathOperation("")
    setDisplay("0")
    setLastKey("")
    setDot(true)
  }

  const handleClick = (event) => {
    let lastCharacter = event.target.innerText;
    const endOfMath = /[+\-*/]0$/
    if(lastCharacter === "x") lastCharacter = "*"
    if(lastCharacter === "0") {
      if(math === "0" || endOfMath.test(math)) return
    }
    if(lastKey === "=") {
      if(operators.includes(lastCharacter)) {
        setMathOperation(math + lastCharacter)
        setMath(prevState => prevState + lastCharacter)
        setDisplay(lastCharacter)
        setLastKey(lastCharacter)
        setDot(true)
        return
      }
      if(lastCharacter === ".") {
        setMath("0.")
        setMathOperation("0.")
        setDisplay("0.")
        setLastKey(lastCharacter)
        setDot(false)
        return
      }
      setMath(lastCharacter)
      setMathOperation(lastCharacter)
      setDisplay(lastCharacter)
      setLastKey(lastCharacter)
      setDot(true)
      return
    }
    if(lastCharacter === ".") {
      if(!dot) return
      else {
        if(!math) {
          setMath("0.")
          setMathOperation("0.")
          setDisplay("0.")
          setLastKey(lastCharacter)
          setDot(false)
          return
        }
        if(isNaN(math.charAt(math.length - 1))) {
          setMath(prevState => prevState + "0.")
          setMathOperation(prevState => prevState + "0.")
          setDisplay("0.")
          setLastKey(lastCharacter)
          setDot(false)
          return
        }
        setMath(prevState => prevState + lastCharacter)
        setMathOperation(prevState => prevState + lastCharacter)
        setDisplay(prevState => prevState + lastCharacter)
        setLastKey(lastCharacter)
        setDot(false)
        return
      }
    }
    if(operators.includes(lastCharacter)) {
      const allButRest = "+*/"
      if(operators.includes(lastKey)) {
        if(math.length === 1) {
          setMath(lastCharacter)
          setMathOperation(lastCharacter)
          setDisplay(lastCharacter)
          setLastKey(lastCharacter)
          return
        }
        if(operators.includes(math[math.length - 2])) {
          if(allButRest.includes(lastCharacter)) {
          setMath(prevState => prevState.slice(0, -2) + lastCharacter)
          setMathOperation(prevState => prevState.slice(0, -2) + lastCharacter)
          setDisplay(lastCharacter)
          setLastKey(lastCharacter)
          return
          }
          return
        }
        if(lastCharacter !== "-") {
          setMath(prevState => prevState.slice(0, -1) + lastCharacter)
          setMathOperation(prevState => prevState.slice(0, -1) + lastCharacter)
          setDisplay(lastCharacter)
          setLastKey(lastCharacter)
          return
        }
      }
      setMath(prevState => prevState + lastCharacter)
      setMathOperation(prevState => prevState + lastCharacter)
      setDisplay(lastCharacter)
      setLastKey(lastCharacter)
      setDot(true)
      return
    }
    if(lastKey === "0") {
      if(math === "0" || math.charAt(math.length - 1) === "0" && operators.includes(math.charAt(math.length - 2))) {
        setMath(prevState => prevState.slice(0, -1) + lastCharacter)
        setMathOperation(prevState => prevState.slice(0, -1) + lastCharacter)
        setDisplay(lastCharacter)
        setLastKey(lastCharacter)
        return
      }
    }
    setMath(prevState => prevState + lastCharacter)
    setMathOperation(prevState => prevState + lastCharacter)
    setDisplay(prevState => {
      if(prevState === "0" || operators.includes(prevState.charAt(prevState.length - 1))) return lastCharacter
      else return prevState + lastCharacter
    })
    setLastKey(lastCharacter)
  }

  const handleMathOperation = () => {
    if(!math || math === "+" || math === "-" || math === "*" || math === "/") {
      setMath("NaN")
      setMathOperation("= NaN")
      setDisplay("NaN") 
      setLastKey("=")
      return
    }
    if(lastKey === "=" || operators.includes(math.charAt(math.length - 1)) || math.length === 2 && math.charAt(math.length - 2) === "*" || math.charAt(math.length - 2) === "/") return
    setMathOperation(`${math} = ${evaluate(math)}`)
    setDisplay(String(evaluate(math)))
    setMath(evaluate(math))
    setLastKey("=")
  }

  return (
    <main className='container'>
      <div className='calculator'>
        <div className='firstRow'>
          <p>{mathOperation}</p>
          <p id='display'>{display}</p>
        </div>
        <div className='mathSymbols'>
          <button id='clear' onClick={handleClear}>AC</button>
          <button id='divide'onClick={handleClick}>/</button>
          <button id='multiply'onClick={handleClick}>x</button>
        </div>
        <div className='numbers'>
          <Numbers handleClick={handleClick}/>
        </div>
        <div className='mathSymbols2'>
          <button id='add'onClick={handleClick}>-</button>
          <button id='subtract'onClick={handleClick}>+</button>
          <button id='equals' onClick={handleMathOperation}>=</button>
        </div>
      </div>
      <p>Designed and coded By <a target="_blank" href="https://github.com/IggyMartin">Iggy Martin</a></p>
    </main>
  )
}

export default App
