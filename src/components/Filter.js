import FilteredPerson from "./FilteredPerson"

const Filter = ({ persons, hakusana, handleHakusanaChange }) => {
  return(
    <div>filter shown with
      <input value={hakusana} onChange={handleHakusanaChange} />
      <ul>
        {persons
          .filter(person => person.name.toLowerCase().includes(hakusana.toLowerCase()))
          .map(person => <FilteredPerson key={person.name} person={person} />
        )}
      </ul>
    </div>
  )
}

export default Filter