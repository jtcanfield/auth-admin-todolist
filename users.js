const users = [
  {username: "jtdude100", email: "jonathantcanfield@gmail.com"},
  {username: "wtfpeople", email: "wtfpeople@fakeemail.com"}
]


function getUser(username){
  return users.find(function (user) {
    return user.username == username
  });
}

module.exports = {
  find: getUser
}
