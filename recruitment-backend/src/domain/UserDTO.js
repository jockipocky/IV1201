class UserDTO {
  constructor({ username, password, firstName, lastName, email}) {
    this.username = username
    this.password = password
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
  }
}
module.exports = UserDTO