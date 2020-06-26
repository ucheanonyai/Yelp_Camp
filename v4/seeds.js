var mongoose = require("mongoose");
var Campground = require("./models/campgrounds"); //you use ./ when you're requiring something in the same directory
var Comment = require("./models/comment");

var data = [
        {
            name: "De la soul",
            image: "https://images.unsplash.com/photo-1440262206549-8fe2c3b8bf8f?auto=format&fit=crop&w=750&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
            description: "The ultimate seed campground"
        },
        {
            name: "De la soulala",
            image: "https://images.unsplash.com/photo-1440262206549-8fe2c3b8bf8f?auto=format&fit=crop&w=750&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
            description: "The ultimate seed campground Pt.2"
        }
    ];

function seedDb(){
    //clear everything from our database
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } 
        console.log("removed all campgrounds");
        //add campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("added a a campground");
                    //create comments for each campground
                    Comment.create(
                        {
                           text: "this place is awesome",
                           author: "Akpan"
                        },function(err, comment){
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log("added a comment");
                                campground.comments.push(comment);
                                campground.save();
                            }
                    });
                }
            });
        }); //you have the data.forEach inside the .remove function because you have no guarantee that it won't before .remove fnishes
    });
    
    
    
    //add comments
}

module.exports = seedDb;