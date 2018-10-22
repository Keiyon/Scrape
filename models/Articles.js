var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticlesSchema = new Schema ({
    title: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true
    },

    thoughts: {
        type: Schema.Types.ObjectId,
        ref: "Thoughts"
    }
});

var Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;