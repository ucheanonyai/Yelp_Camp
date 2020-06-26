var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    flash           = require("connect-flash"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User            = require("./models/user"),
    seedDb          = require("./seeds");
    
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    
app.use(flash());//this should come before passport configuration 

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

app.use(methodOverride("_method")); //convention
app.set("view engine", "ejs");

//seedDb();

app.use(express.static(__dirname+"/public")); //the best way to access file paths. safest way. it is using everything in the directory

app.use(function(req, res, next){ //this block of code passes in currentUser to every single route and template.
   res.locals.currentUser = req.user; //and remember req.user comes from passport
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes); //my code didn't work till i put these three at the end. Investigate!

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Running Yelp..."); 
});
