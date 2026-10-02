import { useState, useEffect } from "react";
import personServices from "./services/persons";
import './index.css'

const Filter = ({ value, onChange }) => {
  return (
    <div>
      Search: <input value={value} onChange={onChange}></input>
    </div>
  )
}

const Notification = ({ message }) => {
  if (message == null) {
    return null
  }

  return (
    <div className="notify">
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message == null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const Form = (props) => {

  return (
    <form onSubmit={props.onSubmit}>
      <div>
        name: <input value={props.valueName} onChange={props.onChangeName} />
      </div>
      <div>
        Number: <input value={props.valueNumber} onChange={props.onChangeNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Numbers = ({ persons, searchValue, deletePerson }) => {

  return (
    <ul>
      {persons
        .filter(person => person.name.toLowerCase().includes(searchValue.toLowerCase()))
        .map(person => <li key={person.id}>{person.name} {person.number} <button onClick={() => deletePerson(person)}>delete</button></li>
        )}

    </ul>
  )
}
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [newMessage, setNewMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personServices.getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const deletePerson = (person) => {
    if (confirm(`Delete ${person.name}`)) {
      personServices.deletePerson(person.id)
        .then(response => setPersons(persons.filter(person_ => person_.id !== response.id)))
    }
  }
  const addName = (event) => {
    event.preventDefault()
    const person = persons.find(person => person.name === newName)
    if (person) {
      if (confirm(`${newName} is already added to phonebook replace the old number with a new one`)) {
        const newObject = { ...person, number: newNumber }
        personServices.changeNumber(person.id, newObject)
          .then(response => setPersons(persons.map(person_ => person_.id === person.id ? response : person_)))
          .catch(error => {
            setErrorMessage(`Information of ${person.name} has already been removed`)
            setPersons(persons.filter(n => n.id != person.id))
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    }
    else {
      const newObject = {
        name: newName,
        number: newNumber,
      }
      personServices.create(newObject)
        .then(response => {
          setPersons(persons.concat(response))
          setNewMessage(`Added ${response.name}`)
          setTimeout(() => {
            setNewMessage(null)
          }, 5000)
        })
    }
    setNewName("")
    setNewNumber('')
  }

  const handleNameInput = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberInput = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchInput = (event) => {
    setNewSearch(event.target.value)
  }
  return (
    <div>
      <h2>Phonebook</h2>


      <Notification message={newMessage} />
      <Error message={errorMessage} />

      <Filter value={newSearch} onChange={handleSearchInput} />

      <h1>Add New</h1>

      <Form valueName={newName} valueNumber={newNumber} onChangeName={handleNameInput} onChangeNumber={handleNumberInput} onSubmit={addName} />

      <h2>Numbers</h2>

      <Numbers persons={persons} searchValue={newSearch} deletePerson={deletePerson} />

    </div>
  )
}

export default App