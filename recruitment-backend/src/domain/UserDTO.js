class UserDTO {
  constructor({ username, password = null, firstName, lastName, email, role_id}) {
    this.username = username
    this.password = password
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.role_id = role_id
  }
}
module.exports = UserDTO