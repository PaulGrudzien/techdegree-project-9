const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'fsjstd-restapi.db',
    logging: false
});

const db = {
    sequelize,
    Sequelize,
    models: {}
};

db.models.Course = require('./models/course.js')(sequelize);
db.models.User = require('./models/user.js')(sequelize);

db.models.Course.associate(db.models);
db.models.User.associate(db.models);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();


module.exports = db;
