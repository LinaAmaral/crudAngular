var mongoose = require("mongoose");
var Schema = mongoose.Schema; //modelo do banco
var departmentSchema = new Schema({
    name: String
});

module.exports = mongoose.model("Department", departmentSchema)