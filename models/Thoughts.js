var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ThoughtsSchema = new Schema({

    title: String,

    body: String
});

var Thoughts = mongoose.model("Thoughts", ThoughtsSchema);

module.exports = Thoughts;