const express = require('express');
const router = express.Router();


// handle coming from order is

router.get('/',(req,res,next) =>{
  res.status(200).json({
    message:'Orders get'
  });
});

router.post('/',(req,res,next) =>{
  res.status(201).json({
    message:'Orders created'
  });
});

router.get('/:productId',(req,res,next) =>{
  const id=req.params.productId;
    res.status(200).json({
      message:'You Passed an order id',
      id:id
    });
});


router.delete('/:productId',(req,res,next) =>{
  res.status(200).json({
    message:'Delete order'
  });
});





module.exports=router;
