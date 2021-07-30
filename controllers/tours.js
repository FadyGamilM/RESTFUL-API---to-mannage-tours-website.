const TourModel = require('../models/tourModel');

// controller for GET request to show all tours
exports.getAllTours = async(req,res,next)=>{
   try{
      // get all tours from tours collection:
      //// ==> a way to be able to filter: BY CHAINING THE FILTERATION METHODS AND PASSING THE QUERY PARAMS MANUALLY 
      //  const AllTours = await TourModel.find().where('name').equals('Dahab');

      /*==> actually our URL will contain some query parameters that we don't need to filter based on them, 
               But those parameters will be used in paging and sorting and other techniques we will learn, so we need to eliminate them.
               And NOTE that as we need to delete some query parameters from the original query parameters that come to us to be able 
               to use the remaining parameters in filteration, we also need to use the deleted ones in other techniques, so we will copy the original parameters object */
      
      // Take a copy from original object by creating a new object from this req.query object, here we destructed it and bundled it with {} to be new object
      // if we write QUERY = req.query; any change to QUERY will reflect to original req.query which something we don't as we need to filter req.query for sorting and paging..
      const QUERY = {...req.query};

      // create temp array of parameters we need to execlude:
      const execluded_parameters = ['page', 'sort', 'limit', 'fields'];

      // parse this copy to get only the filteration parametrs:
      // by deleting key-value pair from QUERY object by the key name if key name matches one of execluded_parameters
      execluded_parameters.forEach(paramter => { delete QUERY[paramter]; });

      //// NOW LETS MAKE FILTERING IN MORE ADVANCED WAY BY SUPPORTING gte, lte, gt, lt
      // convert the query to string to be able to add the $ befor any catched operator so mongodb can understand the query that contains gte, lte, ..
      const QUERY_without_handling_operators = JSON.stringify(QUERY);
      //--> {"cost":{"gte":"4000"},"rating":{"gt":"4"}}

      // add the $
      const QUERY_after_handling_operators = QUERY_without_handling_operators.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`); 
      //-->{"cost":{"$gte":"4000"},"rating":{"$gt":"4"}}
      
      // first take the query that returned from TourModel.find(QUERY), and later we can execute the filteration by using await, but if we used await now, we cannot apply sorting or paging later because the query will be executed and the matched document will be returned
      let filtered_query = TourModel.find(JSON.parse(QUERY_after_handling_operators));
      
      /* after using mode.find(), the return value from it is a query, so now we have all documents that matched the query_with_operators
         now we need to apply sorting and paging, so we can chain methods to the returned query
      */

// [1] ==> handle sorting: 
      // check that the original req.query has sort field:
      if(req.query.sort){
         // sort the filter_query based on the sort field value:
         /////--> NOTE that this sort method is a chained method that can be chained to returned query from find(), so its not a regular sort() method in js
         //filtered_query.sort(req.query.sort); // HINT, if you need to sort in descending order: ?sort=-cost "so we put - sign behind the field"
         
         // Note that we can sort by first option, if more than 1 item are equals in this option, we can use another option, and mongoose use this syntax:
         // sort("OPTION1 OPTION2 ....."), so we need to use this syntax, but in url we put "," between options so we have to parse it.
         let sort_By = req.query.sort.split(',').join(' ');
         filtered_query = filtered_query.sort(sort_By);
      }else{
         // default sorting.
         filtered_query.sort("rating");
      }

// [2] ==> handle Fields limitation : feature to provide that your api can return the user specific fields only from the document not the whole document
      // check that the original req.query has fields field:
      if(req.query.fields){
         let fields = req.query.fields.split(',').join(' ');
         filtered_query = filtered_query.select(fields);
      }else{
         filtered_query = filtered_query.select('-__v'); // return all fields -if user didn't select which fields he required- except the __v field.
      }

      // now execute the query by filtering based on the remaining parameters..
      const AllTours = await filtered_query;
      // finally send the response
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