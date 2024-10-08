const fs = require('fs').promises;
const path = require('path');

let items = [];
let categories = [];

function initialize() {
    return Promise.all([
        fs.readFile(path.join(__dirname, 'data', 'items.json'), 'utf8')
            .then(data => {
                items = JSON.parse(data);
            }),
        fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8')
            .then(data => {
                categories = JSON.parse(data);
            })
    ])
    .then(() => {
        if (items.length === 0 || categories.length === 0) {
            throw new Error("Data is empty");
        }
    })
    .catch(err => {
        throw new Error(`Unable to read file: ${err.message}`);
    });
}

function getAllItems() {
    return new Promise((resolve, reject) => {
        if (items.length > 0) {
            resolve(items);
        } else {
            reject("No results returned");
        }
    });
}

function getPublishedItems() {
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published === true);
        if (publishedItems.length > 0) {
            resolve(publishedItems);
        } else {
            reject("No results returned");
        }
    });
}

function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length > 0) {
            resolve(categories);
        } else {
            reject("No results returned");
        }
    });
}

module.exports = {
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories
};