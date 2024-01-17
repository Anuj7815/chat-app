const express = require('express');
const app = express();
const chats = require('./data/data');
const PORT = process.env.PORT || 3100;
const connectDB = require('./config/DB');
const dotenv = require('dotenv');
const { notFound, errorHandler } =require('./middleware/errorMiddleware.js'); 
const color = require('colors');
const userRoutes=require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes.js');
dotenv.config();

connectDB();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hi there my name is Anuj Gupta and iits new');
  // console.log('Anuj');
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);


app.use(notFound);
app.use(errorHandler);

app.listen(PORT,()=> {
  console.log(`Server Running on PORT: ${PORT}`.blue.bold);
});