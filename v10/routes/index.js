var express = require("express");
var router = express.Router({mergeParams: true}); //proper way
var passport = require("passport");
var User = require("../models/user");

router.use(function(req, res, next){ //this block of code passes in currentUser to every single route.
   res.locals.currentUser = req.user;
   next();
});

router.get("/", function(req,res){
   res.render("landing"); 
});

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
   User.register(new User({username : req.body.username}), req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render("register");
       }
       
           passport.authenticate("local")(req,res,function(){
              res.redirect("/campgrounds"); 

            });
    }); 
});

router.get("/login", function(req, res){
   res.render("login"); 
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
    
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next(); //if things are fine and you want to move on to the next middleware
    }
    else{
        res.redirect("/login");
    }
}

module.exports = router;