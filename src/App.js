import { useState, useEffect } from 'react'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/persons'
import SuccessNotification from './components/SuccessNotification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [hakusana, setHakusana] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)

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
          setSuccessMessage(`Added ${newName} to the contact list`)
          setTimeout(() => { setSuccessMessage(null) }, 5000)
        })
    } else {
      let korvaa_numero = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (korvaa_numero === true) {
        const henkilo = persons.find(person => person.name === newName)
        const changedPerson = {...henkilo, number: newNumber}
        personService
          .update(henkilo.id, changedPerson)
          .then(response => {
            paivita_nimilista()
            setSuccessMessage(`Updated ${newName}'s phone number`)
            setTimeout(() => { setSuccessMessage(null) }, 5000)
          })
      }
    }
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
          setSuccessMessage(`Deleted ${henkilo.name} from the contact list`)
          setTimeout(() => { setSuccessMessage(null) }, 5000)
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
      <SuccessNotification message={successMessage} />
      <ul>
        {persons.map(person => 
          <Person key={person.name} person={person} deletePerson={deletePerson} />
        )}
      </ul>
    </div>
  )
}

export default App