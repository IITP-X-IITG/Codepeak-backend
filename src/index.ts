require('dotenv').config()
import express, { Application } from 'express';
import mongoose, { ConnectionOptions } from 'mongoose';

const app: Application = express();
const port = process.env.PORT || 3000;
const dbURI = process.env.URL;

// Connect to MongoDB
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectionOptions)
  .then(() => {
    console.log('Connected to MongoDB');

    // Set up your Express routes here

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
