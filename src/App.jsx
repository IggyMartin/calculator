import React, { useState } from 'react'
import './App.css'
import Numbers from './numbers/Numbers'
import { evaluate } from 'mathjs'

function App() {
  const [math, setMath] = useState("") // state where we keep the math calculation
  const [mathOperation, setMathOperation] = useState(math) // we use this state to display the current math calculation in screen together with its result when '=' is clicked
  const [display, setDisplay] = useState("0") // state to display in screen the last number/s or math operator clicked
  const [lengthLimit, setLengthLimit] = useState(false)
  const [lastKey, setLastKey] = useState("") // state to keep the value of the last button pressed
  const [dot, setDot] = useState(true) // state to toggle if the '.' is clickable or not (so a user can't add one '.' after another or try to add another dot on a number which is already decimal)
  const operators = '+-*/';

  // when clicking 'AC' we reset the states and make the '.' button clickable
  const handleClear = () => {
    setMath("")
    setMathOperation("")
    setDisplay("0")
    setLastKey("")
    setDot(true) // when set to true, '.' can be added to an operation
  }

  const handleClick = (event) => {
    let lastCharacter = event.target.innerText; // equals the value of the button clicked
    if(lastCharacter === "x") lastCharacter = "*" // adapt the value of the multiplication character

    if(lastKey === "=") { //the user previously clicked '='
      if(operators.includes(lastCharacter)) { // continued with a math operator, which will continue the calculation from the result of the last one
        setMathOperation(math + lastCharacter)
        setMath(prevState => prevState + lastCharacter)
        setDisplay(lastCharacter)
        setLastKey(lastCharacter)
        setDot(true)
        return
      }
      // continued with a '.' which will start a new operation
      if(lastCharacter === ".") {
        setMath("0.")
        setMathOperation("0.")
        setDisplay("0.")
        setLastKey(lastCharacter)
        setDot(false) // when set to false (cause we already added one '.'), the code button will stop on line 54 if we try adding another '.'
        return
      }
      // continued with a number which will start a new operation
      setMath(lastCharacter)
      setMathOperation(lastCharacter)
      setDisplay(lastCharacter)
      setLastKey(lastCharacter)
      setDot(true)
      return
    }
    if(lastCharacter === ".") { // user clicked '.'
      if(!dot) return // if a '.' is already in the number and we try adding another we won't be able
      else { // no '.' in the number
        if(!math) { // in case '.' is the first button clicked for the operation we start it as '0.'
          setMath("0.")
          setMathOperation("0.")
          setDisplay("0.")
          setLastKey(lastCharacter)
          setDot(false)
          return
        }
        if(operators.includes(math.charAt(math.length - 1))) { // if the last character in the operation is a math operator we continue it with '0.'
          setMath(prevState => prevState + "0.")
          setMathOperation(prevState => prevState + "0.")
          setDisplay("0.")
          setLastKey(lastCharacter)
          setDot(false)
          return
        }
        // if the last character is a number we add a '.' to the current number
        setMath(prevState => prevState + lastCharacter)
        setMathOperation(prevState => prevState + lastCharacter)
        setDisplay(prevState => prevState + lastCharacter)
        setLastKey(lastCharacter)
        setDot(false)
        return
      }
    }
    if(operators.includes(lastCharacter)) { // user clicked a math operator
      const allButRest = "+*/"
      if(operators.includes(lastKey)) { // if last character in operation is a math operator
        if(math.length === 1) { // a math operator is the only character in the operation, we set the operation to be the operator clicked
          setMath(lastCharacter)
          setMathOperation(lastCharacter)
          setDisplay(lastCharacter)
          setLastKey(lastCharacter)
          return
        }
        if(operators.includes(math[math.length - 2])) { // if the second last character is a math operator
          // this will be executed when there are 2 consecutive math operators ('+-', '*-', '/-') and the user clicks another one
          if(allButRest.includes(lastCharacter)) { // last character is an operator (excluding '-')
            /*
            The code in this statement will take the last two characters of the operation (the
            math operators) and replace them by the clicked one
            e.g: '5*-' ('+' was clicked) --> '5+'
            */
          setMath(prevState => prevState.slice(0, -2) + lastCharacter)
          setMathOperation(prevState => prevState.slice(0, -2) + lastCharacter)
          setDisplay(lastCharacter)
          setLastKey(lastCharacter)
          return
          }
          return // if '-' was clicked we return so we can't add another '-' to the operation. e.g: "5*-" won't accept another '-'
        }
        if(lastCharacter !== "-") { 
          // we replace the operation's last character (math operator) with the recently clicked one
          setMath(prevState => prevState.slice(0, -1) + lastCharacter)
          setMathOperation(prevState => prevState.slice(0, -1) + lastCharacter)
          setDisplay(lastCharacter)
          setLastKey(lastCharacter)
          return
        }
      }
      /* 
      if the operation's last character is a number, we concatenate the clicked operator
      to the current operation. It will also execute the following code if the operation's
      last character is a '-' and the user clicked it again, as in: e.g: '5-' --> '5--'
      */
      setMath(prevState => prevState + lastCharacter)
      setMathOperation(prevState => prevState + lastCharacter)
      setDisplay(lastCharacter)
      setLastKey(lastCharacter)
      setDot(true)
      return
    }
    if(lastKey === "0") { // '0' is the operation's last character
    const endOfMath = /[+\-*/]0$/ // regex to check if a string ends with an operator followed by a '0'
      if(math === "0" || endOfMath.test(math)) {
        // if the operation is currently = '0' or a '0' follows a math operator, we replace the '0' with the clicked number
        setMath(prevState => prevState.slice(0, -1) + lastCharacter)
        setMathOperation(prevState => prevState.slice(0, -1) + lastCharacter)
        setDisplay(lastCharacter)
        setLastKey(lastCharacter)
        return
      }
    }
    // setting digit limit. Will alternate the display text between the operation and 'digit limit met'
    if(display.length === 22) {
      setLengthLimit(true)
      setTimeout(() => {
        setLengthLimit(false)
      }, 1500)
      return
    }
    // if a number from 1-9 was clicked we add it to the operation
    setMath(prevState => prevState + lastCharacter)
    setMathOperation(prevState => prevState + lastCharacter)
    setDisplay(prevState => {
      // set the display to the clicked number if operation is '0' or it's last character is a math operator
      if(prevState === "0" || operators.includes(prevState.charAt(prevState.length - 1))) return lastCharacter
      else return prevState + lastCharacter // if already a number, display will be a chain of numbers
    })
    setLastKey(lastCharacter)
  }

  const handleMathOperation = () => {
    // if user clicked '=' and the operation is empty or a math operator, we set it to NaN
    if(!math || math === "+" || math === "-" || math === "*" || math === "/") {
      setMath("NaN")
      setMathOperation("= NaN")
      setDisplay("NaN") 
      setLastKey("=")
      return
    }
    // if user tries to make a math operation which is starting with a multiplication or division operator, we alert them 
    if(math.length > 1 && math[0] === "*" || math[0] === "/") return alert("Do not start your operation with a multiplication or division operator")
    // won't evaluate if user clicked '=' after previously clicking it, or the operation ends with a math operator 
    if(lastKey === "=" || operators.includes(math.charAt(math.length - 1))) return
    setMathOperation(`${math} = ${evaluate(math)}`) // we use the evaluate imported function to make the math operation and show it together with it's result
    setDisplay(String(evaluate(math))) // we 'stringify' the math operation result in case it ends in NaN, and display the result
    setMath(evaluate(math)) // we set the math operation to be the result of the previuos
    setLastKey("=") // set the 'lastKey' to '=' to continue the operation from this result
  }

  return (
    <main className='container'>
      <div className='calculator'>
        <div className='screen'>
          <p className='showMath'>{mathOperation}</p>
          {lengthLimit ? (
            <p>Digit Limit Met</p>
          ) : (
            <p id='display'>{display}</p>
          )} 
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
