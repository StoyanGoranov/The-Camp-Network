require ('dotenv').config();
const express 		= require("express"),
	  app 			= express(),
	  bodyParser 	= require("body-parser"),
	  mongoose 		= require("mongoose"),
	  flash			= require("connect-flash"),
	  passport		= require("passport"),
	  LocalStrategy	= require("passport-local"),
	  methodOverride = require("method-override"),
	  passportLocalMongoose = require ("passport-local-mongoose"),
	  Campground 	= require("./models/campground"),
	  Comment		= require("./models/comment"),
	  User			= require("./models/user"),
	  seedDB		= require("./seeds");
	  
	 
const campgroundRoutes = require("./routes/campgrounds"),
	  commentRoutes = require ("./routes/comments"),
	  indexRoutes = require ("./routes/index");
	  

// connect to database
var url;
console.log("Default database url set to: " + process.env.DATABASEURL);
console.log("If condition will follow first branch: "+!process.env.DATABASEURL);
if(!process.env.DATABASEURL){
	url =  "mongodb://localhost/yelp_camp";
} else {
	url = process.env.DATABASEURL;
}

mongoose.connect(url, {
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
	useFindAndModify: false
}).then(() =>{
	console.log("Connected to DB");
}).catch(err =>{
	console.log("ERROR: ", err.message);
});
// use body parser in order to succesfully retrieve info from a get request
app.use(bodyParser.urlencoded({extended: true}));
//use public directory for front-end resources
app.use(express.static(__dirname + "/public"));
//set default engine of fron-end files to ejs
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();



//Passport config
app.use(require("express-session")({
	secret:"picikurchi",
	resave: false,
	saveUninitialized: false
}));
app.locals.moment = require("moment");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.info = req.flash("info");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


const port = process.env.PORT || 3000;
app.listen(port,function(){
	console.log("YelpCamp server started! ");
	console.log("working in v15!");
	console.log("Production version 2.0");
	
	
});