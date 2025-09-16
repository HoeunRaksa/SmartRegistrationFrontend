import { useState } from 'react'
import Nabar  from './Components/Nabar'
import MainRouter from './Router/mainRouter';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Nabar/>
      <MainRouter/>
    </>
  )
}

export default App
