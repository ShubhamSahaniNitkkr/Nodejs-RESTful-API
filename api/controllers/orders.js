const Order = require('../models/orders');

exports.orders_get_all =(req,res,next) =>{
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
}
