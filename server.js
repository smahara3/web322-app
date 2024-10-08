const express = require("express");
const path = require("path");
const storeService = require("./store-service");

const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define routes
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
    storeService.getAllItems()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json({ message: err });
        });
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

// 404 route - This should be the last route
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// Initialize the store service and start the server
storeService.initialize()
    .then(() => {
        // Start the server
        app.listen(port, () => {
            console.log(`Express http server listening on ${port}`);
        });
    })
    .catch((err) => {
        console.error(`Failed to initialize store service: ${err}`);
    });
    