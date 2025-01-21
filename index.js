import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import projectRoutes from './projectRoutes.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));


async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URL + process.env.MONGODB_PORT + '/' + process.env.MONGODB_NAME);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }
}

connect();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
    next();
})

app.use('/projects', projectRoutes);


app.listen(process.env.PORT, () => {
    console.log('Server luistert op poort 8000');
});
