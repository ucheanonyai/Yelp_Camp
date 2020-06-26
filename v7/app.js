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
    
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    
    
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

app.use(function(req, res, next){ //this block of code passes in currentUser to every single route.
   res.locals.currentUser = req.user;
   next();
});

app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes); //my code didn't work till i put these three at the end. Investigate!

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Running Yelp..."); 
});
