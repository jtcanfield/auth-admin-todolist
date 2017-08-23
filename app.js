const express = require('express');
const path = require('path');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const app = express();
const file = './data.json';
const fs = require('fs');
var authSession = "";

const session = require('express-session');
var sessionCookie = { secret: 'this-is-a-secret-token', cookie: { maxAge: 60000, httpOnly: false}};
app.use(session(sessionCookie));

// const loginRouter = require ("./routes/login");//Requires a file
// app.use("/login", loginRouter);//assigns the required file to a route

// const signupRouter = require ("./routes/signup");//Requires a file
// app.use("/signup", signupRouter);//assigns the required file to a route

app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));

// Set app to use bodyParser()` middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());


app.get("/login", function (req, res) {
  res.render('login');
});

app.get("/signup", function (req, res) {
  res.render('signup');
});

//LOGIN PAGE BELOW
app.post("/login", function (req, res) {
  // var sessionCookie = req.sessionStore.sessions[req.sessionID];
  var username = req.body.username;
  var password = req.body.password;
  const UserFile = require("./users.js");//This requires another file
  var user = UserFile.find(username);//this uses that other file's ".find"
  if (UserFile.find(username) === undefined){
    res.render('login', { status: "Incorrect Username or Password"});//reloads page
  } else if (UserFile.find(username) !== undefined){
    if (user.password === password){
      authSession = username;
      res.redirect('/');
    } else {
      res.render('login', { status: "Incorrect Username or Password"});//reloads page
    }
  }
});

app.post("/logout", function (req, res) {
  authSession = "";
  res.redirect('/');
});

app.post("/signuppageredirect", function (req, res) {
  authSession = "";
  res.redirect('/signup');
});

//This is the initial rendering, saying to use index.mustache, and declares todosMustache
app.get("/", function (req, res) {
  if (authSession === ""){
    res.redirect('login');
    return
  } else {
  }
  //fs.readFile reads the data.json file
  fs.readFile(authSession+'data.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      obj = JSON.parse(data);//Turns data.json into an object named obj
      var todoarray = obj.todoArray; //declares makes the todoarray
      var donearray = obj.doneArray; //declares makes the donearray
      // this makes todosMustache the todoarray var
      res.render('index', { todosMustache: todoarray,  doneMustache: donearray, username: authSession});
  }});
  // This will make todosMustache the todosArray
  // res.render('index', { todosMustache: todosArray });
});

//This means that every time method="post" is called on action="/", it will add to the array and redirect the user
app.post("/", function (req, res) {
  if (authSession === ""){
    res.redirect('login');
    return
  } else {
  }
  var addtolist = req.body.inputtodo; //Gets the text in the input tag with name ="inputtodo"
  fs.readFile(authSession+'data.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      obj = JSON.parse(data); //now its an object
      obj.todoArray.push(addtolist); //pushes the text to an array
      json = JSON.stringify(obj); //converts back to json
      fs.writeFile(authSession+'data.json', json, 'utf8'); // writes to file
  }});
  res.redirect('/');//reloads page
});


//This is dynamic, meaning any time i click a button that is not "/", this will fire
app.post("/complete:dynamic", function (req, res) {
  if (authSession === ""){
    res.redirect('login');
    return
  } else {
  }
  fs.readFile(authSession+'data.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      obj = JSON.parse(data); //now its an object
        // iterate over each element in the array
        for (var i = 0; i < obj.todoArray.length; i++){
        // look for the entry with a matching value
          if (obj.todoArray[i] === req.params.dynamic){//req.params.dynamic finds the value of :dynamic
            var change = obj.todoArray[i]; //this sets change to the string to delete
            console.log("I am moving " + change);//logs the string to delete
            obj.doneArray.push(change);//pushes the string to delete to the done array
            obj.todoArray.splice(i, 1);//splices the string from the to do array
          }
        }
      json = JSON.stringify(obj); //converts back to json
      fs.writeFile(authSession+'data.json', json, 'utf8'); // writes to file
  }});
  res.redirect('/');//reloads page
});

//This is the dynamic delete
app.post("/delete:dynamic", function (req, res) {
  if (authSession === ""){
    res.redirect('login');
    return
  } else {
  }
  fs.readFile(authSession+'data.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      obj = JSON.parse(data); //now its an object
        // iterate over each element in the array
        for (var i = 0; i < obj.doneArray.length; i++){
        // look for the entry with a matching value
          if (obj.doneArray[i] === req.params.dynamic){//req.params.dynamic finds the value of :dynamic
            var delfromarray = obj.doneArray[i]; //this sets change to the string to delete
            console.log("I am deleting " + delfromarray);//logs the string to delete
            obj.doneArray.splice(i, 1);//splices the string from the to do array
          }
        }
      json = JSON.stringify(obj); //converts back to json
      fs.writeFile(authSession+'data.json', json, 'utf8'); // writes to file
  }});
  res.redirect('/');//reloads page
});


app.get("/signup", function (req, res) {
  res.redirect('signup');
});
app.post("/signup", function (req, res) {
  res.redirect('signup');
});
app.get("/signupsubmit", function (req, res) {
  res.redirect('signup');
});

app.post("/signupsubmit", function (req, res) {
  var validform = true;
  if (req.body.username === undefined || req.body.password1 === undefined || req.body.password2 === undefined || req.body.email === undefined){
    res.render('signup', {status:"One field is undefined, please try again using valid characters."});
    return
  }
  if (req.body.password1.length < 4){
    res.render('signup', {status:"Password must have at least 4 characters"});
    return
  }
  if (req.body.password1 !== req.body.password2){
    res.render('signup', {status:"Passwords do not match"});
    return
  }
  if (req.body.username.length < 4){
    res.render('signup', {status:"Username must have at least 4 characters"});
    return
  }
  const UserFile = require("./users.js");
  UserFile.userFunctionExport.users.map((x) =>{
    var usernamestring = x.username;
    var emailstring = x.email;
    if (usernamestring.toLowerCase() === req.body.username.toLowerCase()){
      res.render('signup', {status:"Username already exists, choose another user name"});
      validform = false;
      return
    }
    if (emailstring.toLowerCase() === req.body.email.toLowerCase()){
      res.render('signup', {status:"Email already exists. Lost your Username or Password? Email me!"});
      validform = false;
      return
    }
  });
  if (validform === false){return};
  if (validform === true){
    UserFile.addUser({username: req.body.username, password: req.body.password2, email: req.body.email});
  }
  authSession = req.body.username;
  res.redirect('/');
});

app.listen(3000, function () {
  console.log('Hosted on local:3000');
})
