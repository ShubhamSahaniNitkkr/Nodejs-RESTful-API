const express = require('express');
const app = express();
const morgan=require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');


mongoose.connect('mongodb+srv://shubham:'+process.env.MONGO_ATLAS_PW+'@node-rest-shop-fnhtp.mongodb.net/test?retryWrites=true',
{
  useNewUrlParser: true
}
 );


// logger
app.use(morgan('dev'));

// extract json data and make it eaily readable
app.use(bodyParser.urlencoded({extended :false}));
app.use(bodyParser.json());

// course error handling
app.use((req,res,next) =>{
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers',
  'Origin,X-Requested-With,Content-Type,Accept,Authorization');

  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods','PUT,GET,POST,PATCH,DELETE');
    return res.status(200).json({});
  }
  next();
});

// routes to the files
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

// error handling
app.use((req,res,next)=>{
  const error = new Error('NOT FOUND');
  error.status=400;
  next(error);
})

app.use((error,req,res,next)=>{
  res.status(error.status||500);
  res.json({
    error:{
      message:error.message
    }
  });
});

module.exports=app;
