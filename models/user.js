'use strict';

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');


module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
        * This method is not a part of Sequelize lifecycle.
        * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        // define association here
        }
    }
    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "First name is a required field"
                },
                notEmpty: {
                    msg: "Please provide a First Name"
                }
            }
        },      
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Last name is a required field"
                },
                notEmpty: {
                    msg: "Please provide a Last Name"
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "The email you enter already exists"
            },
            validate: {
                notNull: {
                    msg: "An email is required"
                },
                isEmail: {
                    msg: 'Please provide a valid email address'
                }
            }
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A password is required"
                },
                notEmpty: {
                    msg: "Please provide a password"
                },
                len: {
                    args: [8, 12],
                    msg: "The password should be between 8 and 12 characters in length"
                }
            }
        },
        confirmedPassword: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val){
                if(val === this.password) {
                    const hashedPassword = bcrypt.hashSync(val, 8);
                    this.setDataValue('confirmedPassword', hashedPassword);
                }
            },
            validate:{
                notNull: {
                    msg: "Both passwords must match"
                }
            }
        }       
    }, {
        sequelize,
        modelName: 'User',
    });

    User.associate = (models) => {
        //one-to-many
        User.hasMany(models.Course)
    }

    
return User;
};