import app from './app.js';
import dotenv from 'dotenv';
import {sequelize} from './config/dbConnection.js';
import './models/UserModel.js';
import './models/NotesModel.js';

dotenv.config();

sequelize.authenticate()
.then(async()=> {
    console.log('Database connected successfully');
    
    
    await sequelize.sync({ force: false });
    console.log('Database tables synced successfully');
    
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})  
.catch((err)=> {
    console.error('Unable to connect to the database:', err);
});