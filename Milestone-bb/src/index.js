import app from './app.js';
import dotenv from 'dotenv';
import {sequelize} from './config/dbConnection.js';
import './models/UserModel.js';

dotenv.config();

sequelize.authenticate()
.then(async()=> {
    console.log('Database connected successfully');
    
    // Sync database (alter: true will update table structure without losing data)
    await sequelize.sync({ alter: true });
    console.log('Database tables synced successfully');
    
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})  
.catch((err)=> {
    console.error('Unable to connect to the database:', err);
});