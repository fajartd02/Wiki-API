const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// Targeting All Articles
app.route("/articles")
    .get((req, res) => {
        Article.find({}, (err, result) => {
            if (!err) {
                res.send(result);
            } else {
                res.send(err);
            }
        })
    })

    .post((req, res) => {
        console.log(req.body);
        console.log(req.body.title);
        console.log(req.body.content);

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Sucessfully added a new article!");
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if (!err) {
                res.send("Sucessfully delete all articles!");
            } else {
                res.send(err)
            }
        });
    });

app.listen(3000, function () {
    console.log("Server started on http://localhost:3000/");
});

// Targeting Specific Article
app.route("/articles/:titleName")
   .get((req, res) => {
       const { titleName } = req.params;
       Article.findOne({ title: titleName }, (err, result) => {
            if(result) {
                res.send(result);
            } else {
                res.send("No Articles Matching That Title was found!");
            }
       })
   })
   .put((req, res) => {
       const { titleName } = req.params;
       // Update() with overwrite: true 
       // sekarang di mongoose diganti dengan replaceOne()
       Article.replaceOne(
           { title: titleName }, 
           { title: req.body.title, content: req.body.content },
           (err, result) => {
               if(!err) {
                   res.send("Success update!");
               } else {
                   res.send(err + "\n" + result);
               }
           }
        );
   })
   .patch()
   .delete();