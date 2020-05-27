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
            validate: {
                notEmpty: {
                    msg: '`First name` is required'
                }
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
            validate: {
                notEmpty: {
                    msg: '`Last name` is required'
                }
            }
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
            unique: true,
            validate: {
                isEmail: {
                    msq: "enter a valid e-mail"
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
            validate: {
                notEmpty: {
                    msg: '`Password` is required'
                }
            }
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
