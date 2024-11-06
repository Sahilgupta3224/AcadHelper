// import mongoose from 'mongoose'
// import User from '../models/userModel.js'; // Adjust the import path as necessary

// // Replace with your database connection string
// const dbURI = 'mongodb+srv://sahil:sahilbatman@cluster0.xflii.mongodb.net/';

// const migrateAddTotalPoints = async () => {
//     try {
//         // Connect to the database
//         await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        
//         // Update all users to add the Totalpoints field
//         const result = await User.updateMany(
//             {},
//             { $set: { Totalpoints: [] } } // Set Totalpoints to an empty array for existing users
//         );

//         console.log(`Updated ${result.nModified} user documents.`);
//     } catch (error) {
//         console.error('Migration failed:', error);
//     } finally {
//         // Close the database connection
//         mongoose.connection.close();
//     }
// };

// migrateAddTotalPoints();
