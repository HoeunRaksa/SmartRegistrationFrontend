import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Nabar from './Components/Nabar'
import MainRouter from './Router/mainRouter'
import "./App.css";
function App() {
  const [count, setCount] = useState(0)

  return (
   
    <Router>
       <div className="sm:px-5 px-1 py-1">
       <Nabar />
       </div>
       <div className=" relative w-auto h-auto sm:px-5 px-1 py-1">
        <div className="top-0 left-0 absolute overflow-hidden w-full h-full shadow"></div>
      <MainRouter />
      </div>
    </Router>
    
  )
}

export default App
