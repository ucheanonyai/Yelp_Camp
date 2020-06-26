var middlewareObj = {};
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

middlewareObj.checkCampOwnership = function(req,res,next) {
    //is user logged in?
    if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, campground){
            if(err){
                res.redirect("back");
            }
            else{
                //does the user own the campground
                if(campground.author.id.equals(req.user._id)){//we can't use === because campground.author.id is not a string but a mongoose object
                    next();    
                }
                else{
                    res.redirect("back");
                }
            }
        });
    }else{
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
        res.redirect("/login");
    }
}

module.exports = middlewareObj;