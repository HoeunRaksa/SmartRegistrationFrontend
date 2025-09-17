import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Nabar from './Components/Nabar'
import MainRouter from './Router/mainRouter'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Nabar />
      <MainRouter />
    </Router>
  )
}

export default App
