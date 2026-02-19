class UserDTO {
  constructor({ username, password = null, firstName, lastName, email, role_id, personalNumber }) {
    this.username = username
    this.password = password
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.role_id = role_id
    this.personalNumber = personalNumber
  }
}
module.exports = UserDTO