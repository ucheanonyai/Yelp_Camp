var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campgrounds"), //you use ./ when you're requiring something in the same directory
    Comment         = require("./models/comment"),
    seedDb          = require("./seeds");


mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
seedDb();

app.use(express.static(__dirname+"/public")); //the best way to access file paths. safest way. it is using everything in the directory


app.get("/", function(req,res){
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
    //get all campgrounds from the database, then render the file
    Campground.find({}, function(err, campgroundsFromDatabase){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index.ejs", {campgrounds:campgroundsFromDatabase});
        }
    });
});

app.post("/campgrounds", function(req, res){ //since the post is same as get, we're using REST format
   //get data from form and send to array
   //redirect back to campgrounds page
   var name = req.body.name; //you do this when you want to get data from the form
   var image = req.body.image; //that's why you did npm install body-parser -- save
   var description = req.body.description;
   var newObject = {name:name, image:image, description:description};
   
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

app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

//shows more info about one campground
app.get("/campgrounds/:id", function(req, res){ //if you had put this line before the method above it would have treated the new in /campgrounds/new as 
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

//=================
//COMMENTS ROUTES
//=================
app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground:campground}); //this is possible because there is another new in the comments dir in the view dir 
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
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
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/" + campground._id);
               }
            });
        }
    });
    
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Running Yelp..."); 
});
