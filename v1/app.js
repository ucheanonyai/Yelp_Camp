var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var campgrounds = [
                        {name: "Salmon Creek", image: "http://blog.koa.com/wp-content/uploads/unique-campgrounds-626x417.jpg"},
                        {name: "Granite Hill", image: "https://farm7.staticflickr.com/6004/6017807192_bf8b96b3ff.jpg"},
                        {name: "Mountain Goat's Rest", image: "https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg"}
                     ];

app.get("/", function(req,res){
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){ //since the post is same as get, we're using REST format
   //get data from form and send to array
   //redirect back to campgrounds page
   var name = req.body.name; //you do this when you want to get data from the form
   var image = req.body.image; //that's why you did npm install body-parser -- save
   var newObject = {name:name, image:image};
   campgrounds.push(newObject);
   res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Running Yelp..."); 
});
