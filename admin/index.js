const express = require('express');
const app = express();
const PORT = 3001;

const mongoose = require("mongoose");
mongoose.connect("mongodb://db:27017/arthub", { useNewUrlParser: true, useUnifiedTopology: true })
.then( () => console.log('Connected successfully..') )
.catch( (err) => console.log(err) );
const User = require("./model/users");
const ArtGallery = require("./model/artGallery");
app.get('/', async (req, res) => {
    const getUsers = await User.find();
    const getUserImages = await ArtGallery.find({is_deleted: 0});
    getUserImages.forEach(
        data => {
            var img = data.images.replace("public/", "");
            data.images = img;
        }
    );
    res.send(`
      <h1>Welcome to Admin</h1>
      <pre>${JSON.stringify({ getUsers: getUsers }, null, 2)}</pre>
  `);
});

app.listen(PORT, () => {
  console.log(`Admin is running on http://localhost:${PORT}`);
});
