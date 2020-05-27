const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        estimatedTime: Sequelize.STRING,
        materialsNeeded: Sequelize.STRING,
    }, {sequelize});
    
    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            foreignKey:  {
                fieldName: 'userId',
                allowNull: false,
            }
        });
    }
    
    return Course;
};
