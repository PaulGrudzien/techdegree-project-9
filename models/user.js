const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
    }, {sequelize});
    
    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey:  {
                fieldName: 'userId',
                allowNull: false,
            }
        });
    };
    
    return User;
};
