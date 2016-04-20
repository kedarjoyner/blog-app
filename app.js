var bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    app             = express();

// CONFIGURE MONGOOSE
mongoose.connect("mongodb://localhost/blog-app");

// USE EJS
app.set("view engine", "ejs");

// USE STYLESHEET
app.use(express.static("public"));

// USE BODY PARSER
app.use(bodyParser.urlencoded({extended: true}));

// USE METHOD OVERRIDE
  //listens for the underscore method
app.use(methodOverride("_method"));

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
  // retrieve all blogs fromt he DB and and place them in index
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

//CREATE ROUTE FOR EDITING FORM
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

// UPDATE ROUTE OF EDITED FORM
app.put("/blogs/:id", function(req, res){
  // second argument is w/e we call it in "name" form
  // second argument is the newData
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if(err){
      //go back to index
      res.redirect("/blogs");
    } else {
      //brings user back to the right show page for blog
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// SHOW ROUTE

app.get("/blogs/:id", function(req,res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
  // need to find id of blog post
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
  // destroy blogs
  // grab blog by particular id and remove
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

// RUN APP
app.listen(8000, function(){
  console.log("SERVER IS RUNNING!");
});
