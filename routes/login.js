const express = require("express");
const router = express.Router();


router.use(function(req,res,next){
  console.log("LOGIN.JS STEP 1 FIRED")
  next();
})
router.get("/", function(req,res){
  console.log("LOGIN.JS STEP 2 FIRED")
  res.render("login")
})
module.exports = router;
