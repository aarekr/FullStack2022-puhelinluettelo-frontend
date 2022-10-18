const Person = ({ person, deletePerson }) => {
    return(
      <div>{person.name} {person.number}
        <button value={person.id} onClick={deletePerson}>delete</button>
      </div>
    )
}

export default Person