const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const PORT = 3000;
 
const userRouter = require('./routes/user');
const connectDB = require('./config/dataBase');
connectDB();


app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());



app.use('/user' , userRouter);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/user`);
});