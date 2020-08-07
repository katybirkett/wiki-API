const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);
//////////////////targeting ALL articles/////////////////
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Article saved successfully");
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("successfully deleted articles");

      } else {
        res.send(err);
      }
    })
  });

////////////////////targeting a specific article/////////////
app.route("/articles/:articleName")
.get(function(req, res){
  Article.findOne({ title: req.params.articleName }, function (err, item) {
    if(err){
      res.send(err);
    } else if (item)  {
      res.send(item);
    } else {
      res.send(err)
    }
  });
})
.put(function(req, res){
  Article.replaceOne(
    { title: req.params.articleName },
    { title: req.body.title, content: req.body.content},
    function(err){
      if(!err) {
        res.send("successfully updated article")
      } else {
        res.send(err)
      }
    }
  )
})
.patch(function(req, res){
  Article.updateOne({
          title: req.params.articleName  //this part searches the record.
        },
        {$set:req.body},
        function(err) {
          if (err) {
            res.send("err" + err)
          } else {
            res.send("patch successful")
          }
        }
      )
})
.delete(function(req, res){
  Article.deleteOne({title: req.params.articleName},
        function(err) {
          if (err) {
            res.send("err" + err)
          } else {
            res.send("delete successful")
          }
        }
      )
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
