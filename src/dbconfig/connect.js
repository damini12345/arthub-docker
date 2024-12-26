console.log("coming here");
const mongoose = require("mongoose");
mongoose.connect("mongodb://db:27017/arthub", { useNewUrlParser: true, useUnifiedTopology: true })
.then( () => console.log('Connected successfully..') )
.catch( (err) => console.log(err) );