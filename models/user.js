'use strict';

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    class User extends Model {}
    
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "First name is a required field",
                },
                notEmpty: {
                    msg: "Please provide a First Name",
                },
            },
        },      
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Last name is a required field",
                },
                notEmpty: {
                    msg: "Please provide a Last Name",
                },
            },
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "The email you enter already exists",
            },
            validate: {
                notNull: {
                    msg: "An email is required",
                },
                isEmail: {
                    msg: 'Please provide a valid email address',
                },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val){
                const hashedPassword = bcrypt.hashSync(val, 10);
                if(val) {
                    this.setDataValue('password', hashedPassword);
                }
            },
            validate:{
                notNull: {
                    msg: "A password is required",
                },
                notEmpty: {
                    msg: 'Please provide a password',
                },
            }, 
        },       
    }, 
    { sequelize }
    );

    User.associate = (models) => {
        //one-to-many
        User.hasMany(models.Course, {
            as: 'user',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            } 
        });
    };
return User;
};