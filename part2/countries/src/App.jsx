import { useState, useEffect } from "react";
import countryServices from "./services/countries";

const Input = (props) => {
  return (
    <input type="text" value={props.countryValue} onChange={props.onChangeCountry} />
  )
}

const CountryDetails = ({ name }) => {
  const [details, setDetails] = useState(null)

  useEffect(() => {
    countryServices.getByName(name)
      .then(data => setDetails(data))
      .catch(error => console.error("Error fetching country:", error))
  }, [name])

  if (!details) {
    return <p>Loading details...</p>
  }

  return (
    <div>
      <h1>{details.name.common}</h1>
      <p>Capital {details.capital ? details.capital[0] : 'N/A'}</p>
      <p>Area {details.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.entries(details.languages || {}).map(([code, language]) => (
          <li key={code}>{language}</li>
        ))}
      </ul>
      {details.flags && (
        <img
          src={details.flags.png}
          alt={details.flags.alt || `Flag of ${details.name.common}`}
          width="160"
        />
      )}
    </div>
  )
}


const Countries = ({ countries, searchInput, showCountry }) => {
  const matches = countries.filter(country => country.name.toLowerCase().includes(searchInput.toLowerCase()))
  if (matches.length > 10) {
    return (
      <p>
        Too many matches, specify another filter.
      </p>
    )
  }
  if (matches.length === 1) {
    return <CountryDetails name={matches[0].name} />
  }
  return (
    <ul>
      {matches
        .map(country => <li key={country.id}>{country.name} <button onClick={() => showCountry(country.name)}>show</button></li>)}
    </ul>
  )
}


const App = () => {
  const [country, setCountry] = useState([])
  const [searchCountry, setSearchCountry] = useState('')

  useEffect(() => {
    countryServices.getAll()
      .then(response => setCountry(response))
  }, [])
  const handleCountryInput = (event) => {
    setSearchCountry(event.target.value)
  }

  const showCountry = (country) => {
    setSearchCountry(country)
  }

  return (
    <div>
      <h1>Find Countries: </h1>
      <Input countryValue={searchCountry} onChangeCountry={handleCountryInput} />

      <Countries countries={country} searchInput={searchCountry} showCountry={showCountry} />
    </div>
  )
}

export default App