class UserDTO {
  constructor({ username, password = null, firstName, lastName, email, role_id, personalNumber, person_id }) {
    this.username = username
    this.password = password
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.role_id = role_id
    this.personalNumber = personalNumber
    this.person_id = person_id
  }
}
module.exports = UserDTO