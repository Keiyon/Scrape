var express = require("express");
var ehbs = require("express-handlebars");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 8080;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


app.get("/scrape", function(req, res) {

    axios.get("https://www.nytimes.com/section/us/").then(function(response) {

    var $ = cheerio.load(response.data);

    $("article h2 ").each(function(i, element) {

        var result = {};

        result.title = $(this)
            .children("a")
            .text();
            
        result.summary = $(this)
            .children("a")
            .text();

        result.link = $(this)
            .children("a")
            .attr("href");

        db.Article.create(result)
            .then(function(dbArticle) {

                console.log(dbArticle);
            })
            .catch(function(err) {
                
                return res.json(err);
            });
    });

    res.send("Scrape = mission complete");
    });
});

app.get("/articles", function(req, res) {

    db.Article.find({})
        .then(function(dbArticle) {

            res.json(dbArticle)
        })
        .catch(function(err) {

            res.json(err);
        });
});

app.get("/articles/:id", function(req, res) {

    db.Article.findOne({ _id: req.params.id })
        .populate("thoughts")
        .then(function(dbArticle) {
            
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.post("/articles/:id", function(req, res) {
    
    db.Thoughts.create(req.body)
        .then(function(dbThoughts) {

        return db.Article.findOneAndUpdate ({ _id: req.params.id }, { note: dbThoughts._id }, { new: true});
        })
        .then(function(dbArticle) {

            res.json(dbArticle);
        })
        .catch(function(err) {

            res.json(err);
        });
});

app.listen(PORT, function() {
    console.log("This application is running on port " + PORT + "!!!!!!!!!!");
});


