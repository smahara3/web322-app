/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca Academic Policy.  No part 
of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Smriti Mahara
Student ID: 120885231
Date: 10/09/2024
Cyclic Web App URL: https://aback-chivalrous-piano.glitch.me/about
GitHub Repository URL: https://github.com/smahara3/web322-app

********************************************************************************/

const express = require("express");
const path = require("path");
const storeService = require("./store-service");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const app = express();
const port = process.env.PORT || 8080;

// Cloudinary configuration
cloudinary.config({
    cloud_name: "dmbnbd2du",
    api_key: "597639321322191",
    api_secret: "2xkgMLpGverboy8FDSnrEqxM_hg",
    secure: true
});

// Middleware to serve static files
app.use(express.static('public'));

// Parse incoming JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.get('/items/add', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/addItem.html'));
});

app.get("/", (req, res) => {
    res.redirect("/about");
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/shop", (req, res) => {
    storeService.getPublishedItems()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json({ message: err });
        });
});

app.get("/items", (req, res) => {
    const { category, minDate } = req.query;

    if (category) {
        
        storeService.getItemsByCategory(parseInt(category))
            .then((data) => res.json(data))
            .catch((err) => res.status(404).json({ message: err }));
    } else if (minDate) {
       
        storeService.getItemsByMinDate(minDate)
            .then((data) => res.json(data))
            .catch((err) => res.status(404).json({ message: err }));
    } else {
        
        storeService.getAllItems()
            .then((data) => res.json(data))
            .catch((err) => res.status(404).json({ message: err }));
    }
});

app.get("/categories", (req, res) => {
    storeService.getCategories()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json({ message: err });
        });
});

// Initialize multer without disk storage
const upload = multer();

app.post('/items/add', upload.single('featureImage'), (req, res) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }

        upload(req).then((uploaded) => {
            processItem(uploaded.url);
        }).catch((error) => {
            console.error("Error uploading image:", error);
            res.redirect('/items'); // Handle error by redirecting
        });
    } else {
        processItem("");
    }

    function processItem(imageUrl) {
        req.body.featureImage = imageUrl;

        // Use addItem to save the item data
        storeService.addItem(req.body).then((newItem) => {
            res.redirect('/items'); // Redirect after adding the item
        }).catch((err) => {
            console.error("Error adding item:", err);
            res.redirect('/items');
        });
    }
});

// 404 route - This should be the last route
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// Initialize the store service and start the server
storeService.initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`Express http server listening on ${port}`);
        });
    })
    .catch((err) => {
        console.error(`Failed to initialize store service: ${err}`);
    });
