const express = require('express');
const mongoose = require('mongoose');

// require third party middlewares
const bodyParser = require('body-parser');
const morgan = require('morgan');

// require Routes
const toursRoutes = require('./routes/tours');
const errorRoute = require("./routes/error");
const usersRoutes = require("./routes/users");

// Fire the Express Server
const app = express();

// use middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(`${__dirname}/public`));

/*****************DATABASE WORKING ****************************/
// connect to database
let connection_string = "mongodb+srv://mern:mern@cluster0.lz8ax.mongodb.net/natuors?retryWrites=true&w=majority"
mongoose.connect(connection_string,{
   useCreateIndex:true,
   useFindAndModify:false,
   useNewUrlParser:true
}).then(conn=>{
   console.log(conn.connections);
   console.log("DB connected successfully");
   App_Listen();
}).catch(err=>{
   console.log(err);
})


/*********************************************************************/

// handle routes
app.use('/api/v1/tours',toursRoutes);
app.use('/api/v1/users',usersRoutes);
app.use(errorRoute.NotFound);

// listen to PORT 3000
const App_Listen = () => {
   app.listen(3000);
   console.log("app listened to PORT 3000")
};
