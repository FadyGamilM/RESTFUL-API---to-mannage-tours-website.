let users=[
   {
       "name":"Fady",
       "id":1
   },
   {
       "name":"Ahmed",
       "id":2
   },
   {
       "name":"Samy",
       "id":3
   },
   {
       "name":"Magda",
       "id":4
   },
   {
       "name":"Martin",
       "id":5
   },
   {
       "name":"mokhtar",
       "id":6
   }
];
// controller for GET request to show all users
exports.getAllUsers=(req,res,next)=>{
   res.send(users);
};

// controller for POST request to add a new user
exports.PostNewUser=(req,res,next)=>{
   res.send("You Posted a new user");
   users.push({name:req.body.name,id:req.body.id});
};

// controller for GET request to get specific user based on the passed parameter in req.params
// on this route you learn how to parse and get useful data from url
exports.getSpecificUser = (req,res,next)=>{
   users.forEach(user => {
      if (user.id === req.params.id*1){
         res.send(user.name);
      }
   });
};

// controller for patch request to update specific user by its id
exports.update_user=(req,res,next)=>{
   res.send("updated");
   for(let userIndex=0;userIndex<users.length;userIndex++){
      if (users[userIndex].id === req.params.id *1){
         users[userIndex].name=req.body.name;
      }
   }
};

// controller for delete request to delete specific user by its id
exports.delete_user = (req,res,next)=>{
   for(let userIndex=0;userIndex<users.length;userIndex++){
      if (users[userIndex].id === req.params.id *1){
         res.send(` the ${users[userIndex].name} is removed`);
         users.splice(userIndex,1);
      }
   }
};