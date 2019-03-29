const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./uploads/');
  },
  filename:function(req,file,cb){
    cb(null,new Date().toISOString()+file.originalname);
  }
});

const fileFilter = (req,file,cb) =>{
  // rejects a file
  if(file.mimetype === 'image/jpeg' ||file.mimetype === 'image/png')
  {
    cb(null,true);
  }
  else {
    cb(null,false);
  }
}
const upload =multer({
  storage:storage,
  limits:{
  fileSize:1024*1024*5
},
fileFilter:fileFilter
});

// fetching dat from database
router.get('/',(req,res,next) =>{
  Product.find()
  .select("name price _id productImage")
  .exec()
  .then(docs =>{
    console.log(docs);
    res.status(200).json({
      count:docs.length,
      products:docs.map(doc =>{
        return{
          _id:doc._id,
          name:doc.name,
          price:doc.price,
          productImage:doc.productImage,
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
    })
  })
});

router.post('/',checkAuth,upload.single('productImage'),(req,res,next) =>{
console.log(req.file);
  // storing of data using mongodb
  const product = new Product({
    _id:new mongoose.Types.ObjectId(),
    name:req.body.name,
    price:req.body.price,
    productImage:req.file.path
  });
  product.save()
  .then(result =>{
    console.log(result);
    res.status(201).json({
      message:'Product Created Success fully',
      createdProduct :{
        _id:result._id,
        name:result.name,
        price:result.price
      },
      request:{
        type:'GET',
        url :'http://localhost:3000/orders'+result._id
      }
    });
  })
  .catch(err =>{
    console.log(err),
    res.status(500).json({
      error:err
    })
  });
});


// fetch data from mongoDB
router.get('/:productId',(req,res,next) =>{
  const id=req.params.productId;
  Product.findById(id)
  .select("name price _id productImage")
  .exec()
  .then(doc =>{
    console.log("From database",doc);
    if(doc)
    {
      res.status(200).json({
        product:doc,
        request:{
          type:'GET',
          url:'http://localhost:3000/products'
        }
      });
    }else{
      res.status(404).json({
        message:'No valid entry for this id'
      });
    }
  })
  .catch(err => {
    console.log(err),
    res.status(500).json({
      error:err
    })
  });

});

router.patch('/:productId',checkAuth,(req,res,next) =>{
  const id = req.params.productId;
  const updateOps ={};
  for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Product.update({_id:id},{$set:updateOps})
  .exec()
  .then(result =>{
    res.status(200).json(result);
  })
  .catch(err =>{
    console.log(err);
    res.status(500).json({
      error:err
    });
  });
});


router.delete('/:productId',checkAuth,(req,res,next) =>{
  const id = req.params.productId;
  Product.remove({_id:id})
  .exec()
  .then(result =>{
    res.status(200).json({
      message:'Product deleted',
      request:{
        type:'POST',
        url :'http://localhost:3000/products',
        body:{name :'String',price:'Number'}
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
