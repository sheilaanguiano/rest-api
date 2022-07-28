'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        /**
         * Helper method for defining associations.
        * This method is not a part of Sequelize lifecycle.
        * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        // define association here
    }
}
    Course.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A Title is a required"
                },
                notEmpty: {
                    msg: "Please provide a Title"
                }
            }
        },          
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A descriptions is required"
                },
                notEmpty: {
                    msg: "Please provide a Description of the course"
                }
            }
        },  
        estimatedTime:  DataTypes.STRING,
        materialsNeeded:DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Course',
    });

    Course.associate = (models) => {
        //one-to-one 
        Course.belongsTo(models.User, {
            as: 'user',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            } 
        });
    }        

return Course;
};