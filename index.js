const express = require("express");
const hbs = require('hbs');
const path = require('path');
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const multer = require('multer');
const client = require('prom-client');
const fs = require('fs');
//const redis = require('redis');

require("./src/dbconfig/connect");
const User = require("./src/model/users");
const ArtGallery = require("./src/model/artGallery");
const auth = require("./src/middleware/auth");
const router = express.Router();
const logDir = '/arthub/logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logStream = fs.createWriteStream(path.join(logDir, 'app.log'), { flags: 'a' });

const app = express();
const cur_path = path.resolve();
const public_path = path.join(cur_path, "public");

app.use(express.static(public_path));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
// Middleware to track requests
app.use((req, res, next) => {

    res.on('finish', () => {
      httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
    });
    next();
});

// const redisClient = redis.createClient({
//     host: process.env.CACHE_HOST,
//     port: process.env.CACHE_PORT,
// });

// redisClient.on('connect', function() {
//     console.log('Connected to Redis...');
// });

// Create a new registry
const register = new client.Registry();

// Collect default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Create a custom metric (e.g., count of requests)
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
  });
  register.registerMetric(httpRequestCounter);

const viewsPath = path.join(__dirname, "src/views");
app.set("view engine", "hbs");
app.set("views", viewsPath);

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/img')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    },
})

var upload = multer({
    storage: storage
})

app.get("/login", (req, res) => {
    // const data = 'This is some data that can be cached!';
    // redisClient.setex('someData', 60, data);
    res.render("signIn");
});

app.post("/login", async (req, res) => {
    try {
        const password = req.body.password;
        const getUser = await User.findOne({name: req.body.uname});
        const getUserPassword = getUser.password;
        const isMatch = await bcrypt.compare(password, getUserPassword);
        const token = await getUser.generateAuthToken();
        if (isMatch) {
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 3000000),
                httpOnly: true
            });
            res.cookie("user_id", getUser._id.toString(), {
                expires: new Date(Date.now() + 3000000),
                httpOnly: true
            });
            res.status(200).redirect("/");
        } else {
            logStream.write(`${new Date().toISOString()} - ERROR: Password incorrect\n`);
            res.send("Password incorrect")
        }
    } catch(err) {
        logStream.write(`${new Date().toISOString()} - ERROR: ${err}\n`);
        res.send(err);
    }
});

app.get("/register", (req, res) => {
    res.render("signUp");
});

app.post("/register", async (req, res) => {
    try {
        const userData = new User({
            "name": req.body.uname,
            "profileName": req.body.pname,
            "password": req.body.password
        });
    
        const token = await userData.generateAuthToken();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 3000000),
            httpOnly: true
        });
        const result = await userData.save();
        res.cookie("user_id", result._id.toString(), {
            expires: new Date(Date.now() + 3000000),
            httpOnly: true
        });
        res.redirect("/");
    } catch(err) {
        console.log(err);
    }
});

app.get("/", auth, async (req, res) => {
    const aa = await ArtGallery.aggregate(
        [
            // {
            //     $match:
            //     {
            //         is_deleted: 0
            //     }
            // },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'UserDataField'
                }
            }
        ]
    )
    //console.log(JSON.stringify(aa));
    aa.forEach(
        data => {
            var img = data.images.replace("public/", "");
            data.images = img;
            // var bb = JSON.stringify(data.UserDataField);
            // console.log(bb.toString());
        }
    );

    const getAllImages = await ArtGallery.find({is_deleted: 0});
    getAllImages.forEach(
        data => {
            var img = data.images.replace("public/", "");
            data.images = img;
        }
    );
    const getUser = await User.findOne({_id: req.cookies.user_id});
    res.render("dashboard", {imagesData: getAllImages, profileName: getUser.profileName});
}); 

app.get("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((current_element) => {
            return current_element === req.token;
        });
        res.clearCookie('jwt');
        res.clearCookie('user_id');
        await req.user.save();
        res.render("signIn");
    } catch(err) {
        res.send(err)
    }
});

app.get("/upload", auth, (req, res) => {
    res.render("uploadImages");
});

app.post("/uploadImages", upload.array('images', 12), async (req, res, next) => {
    const files = req.files;
    if(!files) {
        res.send("No files choosen to upload")
    }
    try {
        req.files.map(async (file) => {
            const newUpload = new ArtGallery({
              "images": file.path,
              "user_id": req.cookies.user_id
            });
      
            return await newUpload.save();
        });
        res.redirect("/");
    } catch(err) {
        res.send("err")
    }
})

app.get("/profile", auth, async (req, res) => {
    const getUser = await User.findOne({_id: req.cookies.user_id});
    const getUserImages = await ArtGallery.find({user_id: req.cookies.user_id, is_deleted: 0});
    getUserImages.forEach(
        data => {
            var img = data.images.replace("public/", "");
            data.images = img;
        }
    );
    res.render("profile", {imagesData: getUserImages, profileName: getUser.profileName, userId: getUser._id.toString()});
});

app.post("/editProfileName/:userId", async (req, res) => {
    try {
        const updateProfileName = await User.findOneAndUpdate({_id: req.params.userId}, {$set: {profileName: req.body.pname}});
        res.redirect("/profile");
    } catch(err) {
        res.send(err);
    }
});

app.get("/deleteImage/:imageId", async (req, res) => {
    try {
        const updateProfileName = await ArtGallery.findOneAndUpdate({_id: req.params.imageId}, {$set: {is_deleted: '1'}});
        res.redirect("/profile");
    } catch(err) {
        res.send(err);
    }
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.get('/health', (req, res) => {
    res.status(200).send('Healthy');
});

// app.get('/get-cache', (req, res) => {
//     redisClient.get('someData', (err, reply) => {
//       if (reply) {
//         res.send('Cached Data: ' + reply);
//       } else {
//         res.send('No data found in cache');
//       }
//     });
// });

app.listen(3000, ()=> {
    console.log("Hello");
});
