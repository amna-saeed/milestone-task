import { DataTypes } from "sequelize";
import {sequelize} from "../config/dbConnection.js";
import { userModel } from "./UserModel.js";

export const notesModel = sequelize.define('Notes', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userEmail:{
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: userModel,
            key: 'email'
        }
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    content:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    category:{
        type: DataTypes.ENUM('work', 'personal', 'meetings'),
        allowNull: true,  // Optional field
        defaultValue: null
    }
}, {
    tableName: 'Notes',  // Explicitly set table name
    timestamps: true,  // Automatically adds createdAt and updatedAt
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    freezeTableName: true  // Prevent Sequelize from pluralizing table name
});
// Define associations using email as foreign key
userModel.hasMany(notesModel, { foreignKey: 'userEmail', sourceKey: 'email' });
notesModel.belongsTo(userModel, { foreignKey: 'userEmail', targetKey: 'email' });