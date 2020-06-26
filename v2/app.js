var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");
    
    
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//SCHEMA SET UP
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);



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
            res.render("index", {campgrounds:campgroundsFromDatabase});
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
    res.render("new");
});

//shows more info about one campground
app.get("/campgrounds/:id", function(req, res){ //if you had put this line before the method above it would have treated the new in /campgrounds/new as 
                                                //any random id.
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
             res.render("show", {campgrounds:foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Running Yelp..."); 
});
