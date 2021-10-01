const express = require('express');
const app = express();

const dotenv = require('dotenv');

// setting up config.env file variables\
dotenv.config({ path: './config.env' });

const connectDatabase = require('./config/database');

// Connicting to database
connectDatabase();

// Setup body parser 
app.use(express.json());

const PORT = process.env.PORT;

// Import all routes
const jobs = require('./routes/jobs');

app.use('/api/v1', jobs);


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode.`);
})