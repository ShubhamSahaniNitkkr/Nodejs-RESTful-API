const express = require('express');
const app = express();
const morgan=require('morgan');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// app.use((req,res,next)=>{
//   res.status(200).json({
//     message:'it works'
//   });
// })

app.use(morgan('dev'));

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
