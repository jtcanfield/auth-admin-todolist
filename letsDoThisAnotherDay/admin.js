const express = require("express");
const router = express.Router();


router.use(function(req,res,next){
  console.log("middleware authed")
  next();
})
router.get("/", function(req,res){
  console.log("authed admin for admin");
  res.render("admin")
})
router.get("/user-list", function(req,res){
  console.log("authed user-list for admin");
  res.render("userlist")
})
module.exports = router;
