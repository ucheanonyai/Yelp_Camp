var mongoose = require("mongoose");
var Campground = require("./models/campgrounds"); //you use ./ when you're requiring something in the same directory
var Comment = require("./models/comment");

var data = [
        {
            name: "De la soul",
            image: "https://images.unsplash.com/photo-1440262206549-8fe2c3b8bf8f?auto=format&fit=crop&w=750&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
            description: "Duis facilisis nisl vel nibh tristique, eu finibus arcu fermentum. Quisque vestibulum lorem vitae malesuada ullamcorper. Sed nec justo elementum lorem pellentesque imperdiet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt viverra dolor, in ullamcorper purus dapibus et. Vivamus at nibh a urna interdum consectetur. Suspendisse odio ligula, vehicula sed blandit ut, congue vel ligula. Phasellus odio magna, pharetra sed elit nec, elementum tristique dolor. Nulla eu mi risus. Sed varius eros id risus ultrices, id varius elit gravida. Integer vestibulum viverra mattis. Morbi euismod in diam porta sodales. Ut sit amet lectus leo. Nulla venenatis diam dolor, et dapibus libero hendrerit id. Phasellus tincidunt, nisl quis scelerisque rutrum, eros metus accumsan augue, ut fermentum risus augue id nisl. Nam vitae sagittis massa, vitae fermentum lacus."
        },
        {
            name: "De la soulala",
            image: "https://images.unsplash.com/photo-1440262206549-8fe2c3b8bf8f?auto=format&fit=crop&w=750&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
            description: "Duis facilisis nisl vel nibh tristique, eu finibus arcu fermentum. Quisque vestibulum lorem vitae malesuada ullamcorper. Sed nec justo elementum lorem pellentesque imperdiet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt viverra dolor, in ullamcorper purus dapibus et. Vivamus at nibh a urna interdum consectetur. Suspendisse odio ligula, vehicula sed blandit ut, congue vel ligula. Phasellus odio magna, pharetra sed elit nec, elementum tristique dolor. Nulla eu mi risus. Sed varius eros id risus ultrices, id varius elit gravida. Integer vestibulum viverra mattis. Morbi euismod in diam porta sodales. Ut sit amet lectus leo. Nulla venenatis diam dolor, et dapibus libero hendrerit id. Phasellus tincidunt, nisl quis scelerisque rutrum, eros metus accumsan augue, ut fermentum risus augue id nisl. Nam vitae sagittis massa, vitae fermentum lacus."
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