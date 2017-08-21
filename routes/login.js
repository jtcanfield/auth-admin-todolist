const express = require("express");
const router = express.Router();


router.use(function(req,res,next){
  next();
})
router.get("/", function(req,res){
  res.render("login")
})
module.exports = router;
