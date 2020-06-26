var middlewareObj = {};
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

middlewareObj.checkCampOwnership = function(req,res,next) {
    //is user logged in?
    if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, campground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
            else{
                //does the user own the campground
                if(campground.author.id.equals(req.user._id)){//we can't use === because campground.author.id is not a string but a mongoose object
                    next();    
                }
                else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }

}

middlewareObj.checkCommentOwnership = function(req,res,next){
    //is user logged in?
    if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                res.redirect("back");
            }
            else{
                //does the user own the comment
                if(comment.author.id.equals(req.user._id)){//we can't use === because campground.author.id is not a string but a mongoose object
                    next();    
                }
                else{
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next(); //if things are fine and you want to move on to the next middleware
    }
    else{
        req.flash("error", "You need to be logged in to do that!"); //this line then needs to be handled in app.js where you pass it to every
        // single route because "message" is defined in our header file 
        //and it must come before the redirect
        res.redirect("/login");
    }
}

module.exports = middlewareObj;