const express = require("express");
const router = express.Router();
router.use(function(req,res,next){
  console.log("middleware authed")
  next();
})
router.get("/", function(req,res){
  console.log("login page accessed");
  res.render("login")
})
module.exports = router;
