const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const Order = require('../models/orders');
const checkAuth = require('../middleware/check-auth');


// handle coming from order is

router.get('/',checkAuth,(req,res,next) =>{
  Order.find()
  .populate('product')
  .select('product quantity _id')
  .exec()
  .then(docs =>{
    console.log(docs);
    res.status(200).json({
      count:docs.length,
      orders:docs.map(doc =>{
        return{
          _id:doc._id,
          product:doc.product,
          quantity:doc.quantity,
          request:{
            type:'GET',
            url :'http://localhost:3000/orders'+doc._id
          }
        }
      })
    });
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    });
  });
});

router.post('/',checkAuth,(req,res,next) =>{
  Product.findById(req.body.productId)
  .then(product =>{
    if(!product){
      return res.status(404).json({
        message : 'Product not found'
      })
    }
    const order = new Order({
      _id:new mongoose.Types.ObjectId(),
      quantity:req.body.quantity,
      product:req.body.productId
    });
    return order
    .save()

  })
  .then(result =>{
    console.log(result);
    res.status(201).json({
      message:'Orders In the cart',
      createdOrder:{
        _id:result._id,
        product:result.product,
        quantity:result.quantity
      },
      request:{
        type:'GET',
        url :'http://localhost:3000/orders'+result._id
      }
    });
  })
  .catch(err =>{
    console.log(err);
    res.status(500).json({
      error:err
    });
  });

});

router.get('/:orderId',checkAuth,(req,res,next) =>{
  Order.findById(req.params.orderId)
  .exec()
  .then(order =>{
    res.status(200).json({
      order:order,
      request : {
        type:'GET',
        url :'http://localhost:3000/orders'
      }
    });
  })
  .catch(err =>{
    console.log(err);
    res.status(500).json({
      error:err
    });
  });

});


router.delete('/:orderId',checkAuth,(req,res,next) =>{
  Order.remove({_id:req.params.orderId})
  .exec()
  .then(order =>{
    if(!order){
      return res.status(404).json({
        message :"order does not exist !"
      });
    }
    res.status(200).json({
      message:'Orders Deleted',
      request : {
        type:'POST',
        url :'http://localhost:3000/orders',
        body:{
          productId:'ID',
          quantity:'Number'
        }
      }
    });
  })
  .catch(err =>{
    console.log(err);
    res.status(500).json({
      error:err
    });
  });
});





module.exports=router;
