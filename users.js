const users = [
  {username: "jtdude100", password: "jtcjtc", email: "jonathantcanfield@gmail.com"},
  {username: "wtfpeople", password: "wtf3000", email: "wtfpeople@fakeemail.com"}
]


function getUser(username){
  return users.find(function (user) {
    return user.username == username
  });
}

module.exports = {
  find: getUser
}
