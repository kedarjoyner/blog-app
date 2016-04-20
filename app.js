var bodyParser  = require("body-parser")
    mongoose    = require("mongoose"),
    express     = require("express"),
    app         = express();

// CONFIGURE MONGOOSE
mongoose.connect("mongodb://localhost/blog-app");

// USE EJS
app.set("view engine", "ejs");

// USE STYLESHEET
app.use(express.static("public"));

// USE BODY PARSER
app.use(bodyParser.urlencoded({extended: true}));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// *** RESTFUL ROUTES ***

//INDEX
  // homepage
app.get("/", function(req, res){
  res.redirect("/blogs");
});

  // display of all blogs
app.get("/blogs", function(req, res){
  // leave object empty to find all blogs
  // "blogs" argument is the data returned from find()
  Blog.find({}, function(err, blogs){
    if(err){
      console.log("ERROR!");
    } else {
      // render homepage with blog data
      // {blogs: blogs} ---> sends blogs data under name of blogs. Convention to have save name
      res.render("index", {blogs: blogs});
    }
  });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
  res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
  // create blog
  // req.body.blog gets created object from body
  // newBlog holds the object data
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      res.render("new");
    } else {
        // then, redirect to index
      res.redirect("/blogs");
    }
  });
});


// RUN APP
app.listen(8000, function(){
  console.log("SERVER IS RUNNING!");
});
