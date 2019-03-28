const express = require('express');
const router = express.Router();

router.get('/',(req,res,next) =>{
  res.status(200).json({
    message:'Bhai apna GET wala route kaam kr rha hai'
  });
});

router.post('/',(req,res,next) =>{
  res.status(201).json({
    message:'Bhai apna POST wala route kaam kr rha hai'
  });
});

router.get('/:productId',(req,res,next) =>{
  const id=req.params.productId;
  if(id ==='special'){
    res.status(200).json({
      message:'special id khojela hai tu',
      id:id
    });
  }
  else{
    res.status(200).json({
      message:'You Passed an id'
    });
  }
});

router.patch('/:productId',(req,res,next) =>{
  res.status(200).json({
    message:'Updated Product'
  });
});


router.delete('/:productId',(req,res,next) =>{
  res.status(200).json({
    message:'Delete Product'
  });
});





module.exports=router;
