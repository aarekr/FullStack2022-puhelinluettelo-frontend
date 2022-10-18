import { useState, useEffect } from 'react'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [hakusana, setHakusana] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPeople => {
        console.log('promise fulfilled')
        setPersons(initialPeople)
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
      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    } else {
      alert(`${newName} is already added to phonebook`)
    }
    setNewName('')
    setNewNumber('')
  }

  const paivita_nimilista = () => {  // päivitetään nimilista deletoinnin jälkeen
    personService
      .getAll()
      .then(initialPeople => {
        console.log('promise fulfilled')
        setPersons(initialPeople)
      })
  }
  const deletePerson = (event) => {
    event.preventDefault()
    let id = event.target.value
    const henkilo = persons.find(person => person.id === Number(id))
    const poistetaanko = window.confirm(`Delete ${henkilo.name}`)
    if (poistetaanko === true) {
      const url = `http://localhost:3001/persons/${id}`
      personService
        .poista_nimi(url)
        .then(poistettuPerson => {
          setNewName('')
          setNewNumber('')
          paivita_nimilista()
        })
    }
    paivita_nimilista()
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
          <Person key={person.name} person={person} deletePerson={deletePerson} />
        )}
      </ul>
    </div>
  )
}

export default App