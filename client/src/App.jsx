import { useState } from 'react'
import { MapShower } from './MapShower'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div
      // style={{top:0, bottom:0, position:'100vfh'}}
      // style={{ height: "100%", width: '100%', position: 'absolute', top: 0, bottom: 0, right: 0 }}
    >
      {/* <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div> */}
      <MapShower>

      </MapShower>
    </div>
  )
}

export default App
