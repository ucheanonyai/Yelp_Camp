var express = require("express");
var router = express.Router({mergeParams: true}); //proper way
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

router.use(function(req, res, next){ //this block of code passes in currentUser to every single route.
   res.locals.currentUser = req.user; //this means every currentUser variable used is req.user
   next();
});

router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground:campground}); //this is possible because there is another new in the comments dir in the view dir 
        }
    });
});

router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){ //so that if someone still somehow sends a post request, the route is protected
    /*
    lookup campground using id
    create new comment
    connect new comment to campground
    redirect to campground show page
    */
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
                   res.redirect("/campgrounds");
               } 
               else{
                   //add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   
                   //save the comment
                   comment.save();
                   
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/" + campground._id);
               }
            });
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

module.exports = router;