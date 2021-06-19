import {useState, useEffect} from 'react'
import{ ed25519 } from './utils/ed25519'
import{ x25519 } from './utils/x25519'

function App() {
  const [state, setState] = useState({})
  useEffect(()=>{
    (async ()=>{
      setState({
        ed25519: await ed25519(),
        x25519: await x25519()
      })
    })()
  }, [])
  return (
    <div className="App">
      {
        Object.keys(state).map((key)=>{
          return (<div key={key}>
            <h3>{key}</h3>
            <h4>json</h4>
            <pre>{JSON.stringify(state[key]['json'], null, 2)}</pre>
            <h4>base58</h4>
            <pre>{JSON.stringify(state[key]['ld'], null, 2)}</pre>
            <h4>vc, verified: {JSON.stringify(state[key]['verified'], null, 2)}</h4>
            <pre>{JSON.stringify(state[key]['verifiableCredential'], null, 2)}</pre>
            </div>)
        })
      }
      
    </div>
  );
}

export default App;
