import Landing from "./pages/landing"
import Register from "./pages/register"
import Dashboard from "./pages/dashboard"
import { BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/landing' element={<Landing/>}/>
      <Route path='*' element={<div>Error</div>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App

