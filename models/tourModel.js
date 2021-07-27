const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
let tourSchema = new mongoose.Schema({
   name:{// create schema type options for this field
       type:String,
       required: [true,'Tour name is required'],
       unique:true,
   },
   cost:{// create schema type options for this field
       type:Number,
       required: [true,'Tour cost is required'],
       unique:true,
   },
   rating:{// create schema type options for this field
       type:Number,
       default:3.5
   },
});

// create a model
let Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
// // create instance from the model and use it to create a document:
// let tourDoc1 = new Tour({
//   name: "Sharm El Sheikh",
//   cost: 3480,
//   rating:4.6
// });

// // save the created document into our collection:
// tourDoc1.save().then(saved_doc=>{
//   console.log(saved_doc);
// }).catch(error=>{
//   console.log(error);
// });