// import logo from './logo.svg';
import './App.css';
// Components
import './components/DropDownOption';
import List from './components/List';
// Helpers 
import { getAll } from './helpers/getAll';

import { useState, useEffect } from 'react';
import DropDownOption from './components/DropDownOption';

// See the "getAll" helper for a list of endpoints to choose a different default
// "endpoint" is the singular name of a requested resource from pokeapi.co
const defaultEndpoint = "version";

function App({ P }) {
  const [ items, setItems ] = useState([]);
  const [ options, setOptions ] = useState([]);
  const [ selectedEndpoint, setEndpoint ] = useState(defaultEndpoint);

  useEffect(() => {
    P.getEndpointsList()
      .then(function(res) {
        // Set endpoint options in first dropdown select
        setOptions([...Object.keys(res)]);
        getAll(P, selectedEndpoint)()
        .then((response) => {
          setItems(response);
        });
      })
  }, [P]);

  const handleEndpointChange = (e) => {
    const endP = e.target.value;
    // console.log(endP);
    setEndpoint(endP);
    getAll(P, endP)()
      .then((response) => {
        setItems(response);
      });
  }

  const dropDownOptions = options.map((option, i) => <DropDownOption key={i} endpoint={option} optionText={option} />)

  return (
    <div className="App">
      <header className="App-header">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg"
          alt="Pikachu"
          width="50px"
        />
      </header>
      <section>
        <label htmlFor="endpoint">Choose an endpoint:</label><br/>
        <select name="endpoint" id="endpoint" value={selectedEndpoint} onChange={handleEndpointChange}>
          {dropDownOptions}
        </select>
      </section>
      <List endpoint={selectedEndpoint} items={items} />
    </div>
  );
}

export default App;
