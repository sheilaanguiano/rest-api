// Handler function to wrap each route.

//---------Handler function to wrap each route
exports.asyncHandler(callback){
    return async(req, res, next)=>{
      try{
          await callback(req, res, next);
          } catch(error){
            //Forward error to the global error handler
              res.render('error', {error:err});
          }	
      }
  }
  