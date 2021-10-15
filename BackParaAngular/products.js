var mongoose = require("mongoose");
var Schema = mongoose.Schema; //modelo do banco
var productSchema = new Schema({
    name: String
});

module.exports = mongoose.model("Product", productSchema)