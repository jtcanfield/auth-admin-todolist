const express = require("express");
const router = express.Router();


router.use(function(req,res,next){
  console.log("authed")
  next();
})
router.get("/", function(req,res){
  console.log("authed index for admin");
  res.render
})
