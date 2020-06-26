var express = require("express");
var router = express.Router({mergeParams: true}); //proper way
var Campground = require("../models/campgrounds");

router.use(function(req, res, next){ //this block of code passes in currentUser to every single route.
   res.locals.currentUser = req.user;
   next();
});

router.get("/campgrounds", function(req, res){
    //get all campgrounds from the database, then render the file
    Campground.find({}, function(err, campgroundsFromDatabase){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index.ejs", {campgrounds:campgroundsFromDatabase, currentUser:req.user}); //the req.user is gonna help us check
                                                                                                            //whether or not the user is logged in so we 
                                                                                                            //can adjust the nav bar
        }
    });
});

router.post("/campgrounds", isLoggedIn, function(req, res){ //since the post is same as get, we're using REST format
   //get data from form and send to array
   //redirect back to campgrounds page
   var name = req.body.name; //you do this when you want to get data from the form
   var image = req.body.image; //that's why you did npm install body-parser -- save
   var description = req.body.description;
   var author = {
       id:req.user._id,
       username:req.user.username
   };
   var newObject = {name:name, image:image, description:description, author:author};
   
   //create a new campground and save to database
   Campground.create(newObject, function(err, campground){
       if(err){
           console.log(err);
       }
       else{
           res.redirect("/campgrounds");
       }
   });
});

router.get("/campgrounds/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//shows more info about one campground
router.get("/campgrounds/:id", function(req, res){ //if you had put this line before the method above it would have treated the new in /campgrounds/new as 
                                                //any random id.
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){ //this is so that you can have the referenced comments show
        if(err){
            console.log(err);
        }
        else{
             res.render("campgrounds/show", {campgrounds:foundCampground});
        }
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next(); //if things are fine and you want to move on to the next middleware
    }
    else{
        res.redirect("/login");
    }
}

module.exports = router; //we have added all the routes to router, and then we export them