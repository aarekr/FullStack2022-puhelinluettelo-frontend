import { useState, useEffect } from 'react'
import axios from 'axios'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [hakusana, setHakusana] = useState('')

  useEffect(() => {
    console.log("effect")
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()
    const found = persons.find(person => person.name === newName)
    console.log('found:', found)
    if (found === undefined) {
      const nameObject = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(nameObject))
    } else {
      alert(`${newName} is already added to phonebook`)
    }
    setNewName('')
    setNewNumber('')
  }
  
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleHakusanaChange = (event) => {
    console.log(event.target.value)
    setHakusana(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter persons={persons} hakusana={hakusana}
        handleHakusanaChange={handleHakusanaChange} />
      <h2>add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} addPerson={addPerson}
        handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>All numbers</h2>
      <ul>
        {persons.map(person => 
          <Person key={person.name} person={person} />
        )}
      </ul>
    </div>
  )
}

export default App