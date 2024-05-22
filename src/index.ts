import express from 'express';
import bodyParser from 'body-parser';
import weatherRoutes from './routes/weatherRoutes';
import { connectDB } from './models';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(weatherRoutes);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});
