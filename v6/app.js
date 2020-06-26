var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campgrounds"), //you use ./ when you're requiring something in the same directory
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDb          = require("./seeds");
    
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I will marry that girl",
    resave: false,
    saveUninitialized: false
})); //this is your seed
app.use(passport.initialize());// this line and the line below are needed to set passport up
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); //for login
passport.serializeUser(User.serializeUser()); //encode
passport.deserializeUser(User.deserializeUser()); //decode    

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
seedDb();

app.use(express.static(__dirname+"/public")); //the best way to access file paths. safest way. it is using everything in the directory

app.use(function(req, res, next){ //this block of code passes in currentUser to every single route. that means we didn't need it on line 50 but wtv
   res.locals.currentUser = req.user;
   next();
});


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
            res.render("campgrounds/index.ejs", {campgrounds:campgroundsFromDatabase, currentUser:req.user}); //the req.user is gonna help us check
                                                                                                            //whether or not the user is logged in so we 
                                                                                                            //can adjust the nav bar
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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground:campground}); //this is possible because there is another new in the comments dir in the view dir 
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){ //so that if someone still somehow sends a post request, the route is protected
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


//====================
//AUTHENTICATION ROUTES
//====================
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
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

app.get("/login", function(req, res){
   res.render("login"); 
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
    
});

app.get("/logout", function(req, res){
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

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Running Yelp..."); 
});
