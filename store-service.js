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

function addItem(itemData) {
    return new Promise((resolve, reject) => {
        // Set 'published' to false if undefined, otherwise set it to true
        itemData.published = itemData.published !== undefined;

        // Set the 'id' property to be the current length of the items array plus 1
        itemData.id = items.length + 1;

        // Push the item to the items array
        items.push(itemData);

        // Resolve with the newly added item
        resolve(itemData);
    });
}
function getItemsByCategory(category) {
    return new Promise((resolve, reject) => {
        const filteredItems = items.filter(item => item.category === parseInt(category));
        if (filteredItems.length > 0) {
            resolve(filteredItems);
        } else {
            reject("No items found for the specified category");
        }
    });
}
function getItemsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        const minDate = new Date(minDateStr);
        const filteredItems = items.filter(item => new Date(item.postDate) >= minDate);
        
        if (filteredItems.length > 0) {
            resolve(filteredItems);
        } else {
            reject("No items found for the specified date or later");
        }
    });
}
function getItemById(id) {
    return new Promise((resolve, reject) => {
        const item = items.find(item => item.id === parseInt(id));
        if (item) {
            resolve(item);
        } else {
            reject("Item not found");
        }
    });
}



// Combine all exports into a single object
module.exports = {
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories,
    addItem, 
    getItemsByCategory,  // Exporting new function
    getItemsByMinDate,
    getItemById
};
