const express = require('express');
const path = require('path');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const app = express();
const file = './data.json';
const fs = require('fs');
const session = require('express-session');


const loginRouter = require ("./routes/login");//Requires a file
app.use("/login", loginRouter);//assigns the required file to a route

app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));

// Set app to use bodyParser()` middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());


//This is the initial rendering, saying to use index.mustache, and declares todosMustache
app.get("/", function (req, res) {
  //fs.readFile reads the data.json file
  fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      obj = JSON.parse(data);//Turns data.json into an object named obj
      var todoarray = obj.todoArray; //declares makes the todoarray
      var donearray = obj.doneArray; //declares makes the donearray
      // this makes todosMustache the todoarray var
      res.render('index', { todosMustache: todoarray,  doneMustache: donearray});
  }});
  // This will make todosMustache the todosArray
  // res.render('index', { todosMustache: todosArray });
});

//This means that every time method="post" is called on action="/", it will add to the array and redirect the user
app.post("/", function (req, res) {
  var addtolist = req.body.inputtodo; //Gets the text in the input tag with name ="inputtodo"
  fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      obj = JSON.parse(data); //now its an object
      obj.todoArray.push(addtolist); //pushes the text to an array
      json = JSON.stringify(obj); //converts back to json
      fs.writeFile('data.json', json, 'utf8'); // writes to file
  }});
  res.redirect('/');//reloads page
});

app.post("/login", function (req, res) {
  var usernamething = req.body.username;
  const UserFile = require("./users.js");//This requires another file
  UserFile.find(usernamething);//this uses that other file's ".find"
  if (UserFile.find(usernamething) === undefined){
    res.redirect('/login');//reloads page
  } else if (UserFile.find(usernamething) !== undefined){
    res.redirect('/');//reloads page
  }
});


//This is dynamic, meaning any time i click a button that is not "/", this will fire
app.post("/:dynamic", function (req, res) {
  fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
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
      fs.writeFile('data.json', json, 'utf8'); // writes to file
  }});
  res.redirect('/');//reloads page
});


app.listen(3000, function () {
  console.log('Hosted on local:3000');
})
