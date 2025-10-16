import { DataTypes } from "sequelize";
import {sequelize} from "../config/dbConnection.js";
import { userModel } from "./UserModel.js";

export const notesModel = sequelize.define('Notes', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    timestamps: true,  // Automatically adds createdAt and updatedAt
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
});
// Define associations
userModel.hasMany(notesModel, { foreignKey: 'userId', sourceKey: 'userId' });
notesModel.belongsTo(userModel, { foreignKey: 'userId', targetKey: 'userId' });