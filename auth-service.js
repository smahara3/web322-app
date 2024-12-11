

const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User schema definition
const userSchema = new Schema({
  userName: { type: String, unique: true },
  password: String,
  email: String,
  loginHistory: [
    {
      dateTime: Date,
      userAgent: String
    }
  ]
});

// Define the User object later when the connection initializes
let User; // To be defined on new connection

// Initialize database connection
function initialize() {
  return new Promise(function (resolve, reject) {
    const db = mongoose.createConnection("mongodb+srv://maharasmriti:uQLkx86Z4X6dAqwf@cluster0.dwmam.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

    db.on('error', (err) => {
      reject(err); // Reject the promise with the error
    });

    db.once('open', () => {
      User = db.model('users', userSchema); // Initialize the User object
      resolve(); // Successfully connected
    });
  });
}

// Register a new user
function registerUser(userData) {
    return new Promise((resolve, reject) => {
      if (userData.password !== userData.password2) {
        reject("Passwords do not match");
      } else {
        // Hash the password before saving the user
        bcrypt.hash(userData.password, 10) // Salt rounds = 10
          .then(hash => {
            userData.password = hash; // Replace the plain text password with the hash
            let newUser = new User(userData); // Create a new User object
            newUser.save()
              .then(() => resolve())
              .catch((err) => {
                if (err.code === 11000) {
                  reject("User Name already taken");
                } else {
                  reject("There was an error creating the user: " + err);
                }
              });
          })
          .catch(err => {
            reject("There was an error encrypting the password"); // Handle hash errors
          });
      }
    });
  }
  

// Check user credentials
function checkUser(userData) {
    return new Promise((resolve, reject) => {
      User.find({ userName: userData.userName })
        .then((users) => {
          if (users.length === 0) {
            reject(`Unable to find user: ${userData.userName}`);
          } else {
            // Compare the hashed password with the entered password
            bcrypt.compare(userData.password, users[0].password)
              .then((result) => {
                if (result === false) {
                  reject(`Incorrect Password for user: ${userData.userName}`);
                } else {
                  // Add login details to loginHistory
                  users[0].loginHistory.push({
                    dateTime: new Date().toString(),
                    userAgent: userData.userAgent
                  });
  
                  // Update the user loginHistory in the database
                  User.updateOne(
                    { userName: users[0].userName },
                    { $set: { loginHistory: users[0].loginHistory } }
                  )
                    .then(() => resolve(users[0]))
                    .catch((err) => {
                      reject("There was an error verifying the user: " + err);
                    });
                }
              })
              .catch(err => {
                reject("There was an error comparing passwords: " + err);
              });
          }
        })
        .catch(() => reject(`Unable to find user: ${userData.userName}`));
    });
  }
  
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        const db = mongoose.createConnection("mongodb+srv://maharasmriti:uQLkx86Z4X6dAqwf@cluster0.dwmam.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"); // Replace with your connection string

        db.on('error', (err) => {
            reject(err); // Reject the promise with the error
        });

        db.once('open', () => {
            User = db.model('users', userSchema); // Initialize the User model
            resolve(); // Successfully connected
        });
    });
};

// Export all functions
module.exports = {
  initialize,
  registerUser,
  checkUser
};
