import { useState, useEffect } from 'react'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/persons'
import SuccessNotification from './components/SuccessNotification'
import ErrorNotification from './components/ErrorNotification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [hakusana, setHakusana] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
    console.log('Frontend addPerson found:', found)
    if (found === undefined) {
      const nameObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setSuccessMessage(`Added ${newName} to the contact list`)
          setTimeout(() => { setSuccessMessage(null) }, 5000)
        })
        .catch(error => {
          setErrorMessage(`Error: name too short or number missing`)
          setTimeout(() => { setErrorMessage(null) }, 5000)
          paivita_nimilista()
        })
    } else {
      let korvaa_numero = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (korvaa_numero === true) {
        const henkilo = persons.find(person => person.name === newName)
        const changedPerson = {...henkilo, number: newNumber}
        personService
          .update(henkilo.id, changedPerson)
          .then(changedPerson => {
            paivita_nimilista()
          })
      }
    }
    paivita_nimilista()
    setNewName('')
    setNewNumber('')
  }

  const paivita_nimilista = () => {  // apufunktio: päivitetään nimilista muutoksen jälkeen
    personService
      .getAll()
      .then(updatedPeople => {
        setPersons(updatedPeople)
      })
  }

  const deletePerson = (event) => {
    event.preventDefault()
    let id = event.target.value
    const henkilo = persons.find(person => person.id === id)
    console.log("löydetty henkilö:", henkilo)
    const poistetaanko = window.confirm(`Delete ${henkilo.name}`)
    if (poistetaanko === true) {
      personService
        .poista_nimi(id)
        .then(poistettuPerson => {
          setNewName('')
          setNewNumber('')
          paivita_nimilista()
          setSuccessMessage(`Deleted ${henkilo.name} from the contact list`)
          setTimeout(() => { setSuccessMessage(null) }, 5000)
        })
    }
    paivita_nimilista()
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleHakusanaChange = (event) => {
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
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <ul>
        {persons.map(person => 
          <Person key={person.name} person={person} deletePerson={deletePerson} />
        )}
      </ul>
    </div>
  )
}

export default App