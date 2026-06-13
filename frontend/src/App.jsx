import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import Cliente from './pages/Cliente'
import Cocina from './pages/Cocina'
import Admin from './pages/Admin'

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Cliente */}
        <Route
          path="/"
          element={<Cliente />}
        />

        {/* Cocina */}
        <Route
          path="/cocina"
          element={<Cocina />}
        />

        {/* Administrador */}
        <Route
          path="/admin"
          element={<Admin />}
        />

      </Routes>

    </BrowserRouter>

  )

}

export default App