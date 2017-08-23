const express = require('express');
const path = require('path');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const app = express();
const file = './data.json';
const fs = require('fs');
var authSession = "";
var status = "";


//Allows saving to a "scratch" folder, will be created apon logging in
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');



const session = require('express-session');
app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 60000, httpOnly: false}}));






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
  // console.log("SESSION STORE: ");
  // console.log(req.sessionStore);
  // console.log("SESSIONS: "); //USEFUL DATA
  // console.log(req.sessionStore.sessions);//USEFUL DATA
  var sessionCookie = req.sessionStore.sessions[req.sessionID];
    // console.log(sessionCookie);
    // cook = JSON.parse(sessionCookie);
    // console.log(cook.cookie);
  // console.log(sessionCookie); //USEFUL DATA
  // console.log("SESSION ID: ")
  // console.log(req.sessionID);
  // console.log(req.sessionID.login);
  // var now = new Date();
  // console.log(now);
  var username = req.body.username;
  var password = req.body.password;
  const UserFile = require("./users.js");//This requires another file
  var user = UserFile.find(username);//this uses that other file's ".find"
  if (UserFile.find(username) === undefined){
    status = "Incorrect Username or Password";
    res.render('login', { status: status});//reloads page
  } else if (UserFile.find(username) !== undefined){
    if (user.password === password){
      // console.log(user.password);
      authSession = username;
      localStorage.setItem("username", username);
      // cook.cookie.username = username;
      // console.log(cook.cookie.username);
      res.redirect('/');
    } else {
      status = "Incorrect Username or Password";
      res.render('login', { status: status});//reloads page
    }
  }
});

app.post("/logout", function (req, res) {
  authSession = "";
  req.login = undefined;
  res.redirect('/');
});

app.post("/signuppageredirect", function (req, res) {
  authSession = "";
  req.login = undefined;
  res.redirect('/signup');
});

//This is the initial rendering, saying to use index.mustache, and declares todosMustache
app.get("/", function (req, res) {
    // var sessionCookie = req.sessionStore.sessions[req.sessionID];
    // cook = JSON.parse(sessionCookie);
    // console.log(cook.cookie.username);
  // console.log(localStorage.getItem("username"));
  if (authSession === ""){
    status = "";
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
    status = "";
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
    status = "";
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
          if (obj.todoArray[i] === req.params.dynamic){//req.params.dynamic finds the value of dynamic
            var change = obj.todoArray[i]; //this sets change to the string to delete
            console.log("I am deleting " + change);//logs the string to delete
            obj.doneArray.push(change);//pushes the string to delete to the done array
            obj.todoArray.splice(i, 1);//splices the string from the to do array
          }
        }
      json = JSON.stringify(obj); //converts back to json
      fs.writeFile(authSession+'data.json', json, 'utf8'); // writes to file
  }});
  res.redirect('/');//reloads page
});


app.post("/signup", function (req, res) {
  console.log(req.body.username);
  console.log(req.body.password1);
  console.log(req.body.password2);
  console.log(req.body.email);
  res.render('signup');
  // fs.readFile(authSession+'data.json', 'utf8', function readFileCallback(err, data){
  //     if (err){
  //         console.log(err);
  //     } else {
  //     obj = JSON.parse(data); //now its an object
  //       // iterate over each element in the array
  //       for (var i = 0; i < obj.todoArray.length; i++){
  //       // look for the entry with a matching value
  //         if (obj.todoArray[i] === req.params.dynamic){//req.params.dynamic finds the value of dynamic
  //           var change = obj.todoArray[i]; //this sets change to the string to delete
  //           console.log("I am deleting " + change);//logs the string to delete
  //           obj.doneArray.push(change);//pushes the string to delete to the done array
  //           obj.todoArray.splice(i, 1);//splices the string from the to do array
  //         }
  //       }
  //     json = JSON.stringify(obj); //converts back to json
  //     fs.writeFile(authSession+'data.json', json, 'utf8'); // writes to file
  // }});
  // res.redirect('/');//reloads page
});


app.listen(3000, function () {
  console.log('Hosted on local:3000');
})
