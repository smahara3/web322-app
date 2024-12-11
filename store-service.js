

const Sequelize = require('sequelize');

var sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', 'Ccl57yGpUdTh', {
  host: 'ep-rough-sun-a5bdlohf.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectModule: require('pg'), // To resolve runtime Error: Please install pg package manually
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  query: { raw: true }
});

// Define the Item model
const Item = sequelize.define('Item', {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
  price: Sequelize.DOUBLE
});

// Define the Category model
const Category = sequelize.define('Category', {
  category: Sequelize.STRING
});

// Define the relationship
Item.belongsTo(Category, { foreignKey: 'category' });


module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
      sequelize.sync()
          .then(() => resolve('Database sync successful'))
          .catch(err => reject('Unable to sync the database: ' + err));
      sequelize.sync()
          .then(() => resolve('Database sync successful'))
          .catch(err => reject('Unable to sync the database: ' + err));
  });
};

module.exports.getAllItems = () => {
  return new Promise((resolve, reject) => {
      Item.findAll()
          .then(data => resolve(data))
          .catch(err => reject('no results returned: ' + err));
      Item.findAll()
          .then(data => resolve(data))
          .catch(err => reject('no results returned: ' + err));
  });
};

module.exports.getItemsByCategory = (category) => {
  return new Promise((resolve, reject) => {
      Item.findAll({
          where: {
              category: category
          }
      })
          .then(data => resolve(data))
          .catch(err => reject('no results returned: ' + err));
      Item.findAll({
          where: {
              category: category
          }
      })
          .then(data => resolve(data))
          .catch(err => reject('no results returned: ' + err));
  });
};

module.exports.getPublishedItems = () => {
  return new Promise((resolve, reject) => {
      Item.findAll({
          where: {
              published: true
          }
      })
          .then(data => resolve(data))
          .catch(err => reject('no results returned: ' + err));
  });
};

module.exports.getPublishedItemsByCategory = (category) => {
  return new Promise((resolve, reject) => {
      Item.findAll({
          where: {
              published: true,
              category: category
          }
      })
          .then(data => resolve(data))
          .catch(err => reject('no results returned: ' + err));
  });
};

module.exports.getCategories = () => {
  return new Promise((resolve, reject) => {
      Category.findAll()
          .then(data => resolve(data))
          .catch(err => reject('no results returned: ' + err));
  });
};

module.exports.addItem = (itemData) => {
  return new Promise((resolve, reject) => {
      itemData.published = (itemData.published) ? true : false;
      for (let prop in itemData) {
          if (itemData[prop] === "") itemData[prop] = null;
      }
      itemData.postDate = new Date();

      Item.create(itemData)
          .then(() => resolve('item added'))
          .catch(err => reject('unable to add item: ' + err));
  });
};

module.exports.getItemsByMinDate = (minDateStr) => {
  const { gte } = Sequelize.Op;
  return new Promise((resolve, reject) => {
      Item.findAll({
          where: {
              postDate: {
                  [gte]: new Date(minDateStr)
              }
          }
      })
          .then(data => resolve(data))
          .catch(err => reject('no results returned: ' + err));
  });
};

module.exports.getItemById = (id) => {
  return new Promise((resolve, reject) => {
      Item.findAll({
          where: {
              id: id
          }
      })
          .then(data => {
              if (data.length > 0) {
                  resolve(data[0]);
              } else {
                  reject('no results returned');
              }
          })
          .catch(err => reject('no results returned: ' + err));
  });
};

module.exports.addCategory = (categoryData) => {
    return new Promise((resolve, reject) => {
      // Ensure blank values are set to null
      for (let prop in categoryData) {
        if (categoryData[prop] === "") {
          categoryData[prop] = null;
        }
      }
      // Create the category
      Category.create(categoryData)
        .then(() => resolve('category added'))
        .catch(err => reject('unable to create category: ' + err));
    });
  };
  
  module.exports.deleteCategoryById = (id) => {
    return new Promise((resolve, reject) => {
      Category.destroy({
        where: { id: id }
      })
        .then(() => resolve('category deleted'))
        .catch(err => reject('unable to delete category: ' + err));
    });
  };
  
  module.exports.deletePostById = (id) => {
    return new Promise((resolve, reject) => {
      Item.destroy({
        where: { id: id }
      })
        .then(() => resolve('item deleted'))
        .catch(err => reject('unable to delete item: ' + err));
    });
  };

  module.exports.deletePostById = (id) => {
    return new Promise((resolve, reject) => {
      Item.destroy({
        where: { id }
      })
        .then(() => resolve())
        .catch(err => reject("unable to delete post"));
    });
};
