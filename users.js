// const userslist = [
//   {username: "jtdude100", password: "jtcjtc", email: "jonathantcanfield@gmail.com"},
//   {username: "wtfpeople", password: "wtf3000", email: "wtfpeople@fakeemail.com"}
// ]
const path = require('path');
const userJsonFile = require('./users.json');
const bodyParser = require('body-parser');
const file = './data.json';
const fs = require('fs');


function getUser(username){
  return userJsonFile.users.find(function (user) {
    return user.username == username;
  });
}

function addUser(obj){
  fs.readFile('users.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      obj = JSON.parse(data); //now its an object

      json = JSON.stringify(obj); //converts back to json
      fs.writeFile('users.json', json, 'utf8'); // writes to file
  }});
  return
}

module.exports = {
  find: getUser,
  getUser: getUser,
  addUser: addUser,
  // users:userslist,// IN APP.JS: Access static js const with: console.log(UserFile.users);
  userFunctionExport:userJsonFile//IN APP.JS: Access changeable json with: console.log(UserFile.userFunctionExport.userslist);
}
