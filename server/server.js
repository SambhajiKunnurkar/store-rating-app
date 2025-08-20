
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');


dotenv.config();

connectDB();
const app = express();


app.use(express.json());


app.use(cors());
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/stores', require('./routes/storeRoutes'));

app.get('/', (req, res) => {
  res.send('<h1>Welcome! Your server is working!</h1>');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));