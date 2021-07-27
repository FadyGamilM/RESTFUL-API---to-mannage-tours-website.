const TourModel = require('../models/tourModel');

let tours=[
   {
       "name":"Siwa",
       "id":1
   },
   {
       "name":"sharm",
       "id":2
   },
   {
       "name":"Red Sea",
       "id":3
   }
];

// controller for GET request to show all tours
exports.getAllTours = async(req,res,next)=>{
   try{
      // get all tours from tours collection:
      const AllTours = await TourModel.find();
      res.status(200).send(AllTours);
   }catch(error){
      // 404 Not Found
      return res.status(404).json({
         messege:"Not Found",
         problem: error
      });      
   }
};

// controller for POST request to add a new tour
exports.PostNewTour= async (req,res,next)=>{
   try{
      // create new tour document:
      const newTour = await TourModel.create(req.body);
      res.status(201).send(`You Posted a new tour : ${newTour}`);
      //tours.push({name:req.body.name,id:req.body.id});
   }catch(error){
      // 400 is a "bad request".
      return res.status(400).json({
         messege:"Bad Request",
         problem: error
      });
   }

};

// controller for GET request to get specific request based on the passed parameter in req.params
// on this route you learn how to parse and get useful data from url
exports.getSpecificTour = async (req,res,next)=>{
   try{
      // get tour by id from database:
      const tour = await TourModel.findById(req.params.id);
      res.send(tour);
   }catch(error){
      // 404 Not Found
      return res.status(404).json({
         messege:"Not Found",
         problem: error
      });  
   }
};

// controller for patch request to update specific tour by its id
exports.update_tour = async (req,res,next)=>{
   try{
      const updated_tour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
         new : true, // in order to return the updated object
         runValidators : true // for validation purpose, we will back to it later ****
      });
      res.status(200).send(updated_tour);
   }catch(error){
      res.status(400).json({
         message: "Bad Request, Something happen during updated so can't be updated !",
         problem: error
      });
   }
};

// controller for delete request to delete specific tour by its id
exports.delete_tour = async (req,res,next)=>{
   try{
      // in restful api its best practice to not send any data to the client in case of delete request
      await TourModel.findByIdAndDelete(req.params.id);
      res.status(204).send(` The tour is deleted successfully`);
   }catch(error){
      res.status(404).json({
         message: "Cannot deleted successfully!",
         problem: error
      });
   }
};

/** lets learn how to chain middlewares by implementing middleware function
 *    that check the body of the POST request first before creating a new tour
 *    and by using this concept, we make each controller is responsible for a 
 *    functionallity only.
*/
// middleware function to check the body of incoming POST request
// // // // exports.check_body=(req,res,next)=>{
// // // //    if (!req.body.name || !req.body.id){
// // // //       // 400 is a "bad request".
// // // //       return res.status(400).json({
// // // //          messege:"Bad Request",
// // // //          problem: "missing information"
// // // //       });
// // // //    }else{
// // // //       // else, call the next middleware to create the new tour
// // // //       next();
// // // //    }
// // // // };