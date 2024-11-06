import mongoose from 'mongoose';

export async function connect() {
    try {

        const connectionsState=mongoose.connection.readyState 

            if(connectionsState===1)
            {
                console.log("Connections already exists")
                return;
            }

        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit();
        })

    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
        
    }


}