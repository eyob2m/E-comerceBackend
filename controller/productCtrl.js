const isObjectId = require("../config/isObjectId")
const { createError } = require("../middlewares/errorHandling")
const Product = require("../models/productModel")
const slugify = require('slugify')


const createProduct = async (req,res,next) =>{
try {
    if(req.body.title) {
        req.body.slug = slugify(req.body.title)
    }
    const newProduct = await Product.create(req.body)
 
    res.status(200).json({success: true, data:newProduct})
} catch (error) {
   next(error) 
}
}

const updateProduct = async (req, res, next) => {
    try {
     
      const { id} = req.params;
      if(req.body.title) {
        req.body.slug = slugify(req.body.title)
    }
  
      if (!isObjectId(id)) {
        return next(createError(404, "Id is Incorrect"));
      }
    
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
      if (!product) {
        return next(createError(404, "No Product Found"));
      }
  
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

const getaProduct = async (req, res, next) => {
    try {
    
      const { id } = req.params;
  
      if (!isObjectId(id)) {
        return next(createError(404, "Id is Incorrect"));
      }
      const product = await Product.findById(id);
      if (!product) {
        return next(createError(404, "No Product Found"));
      }
  
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  
const getProducts = async (req, res, next) => {
    try {
        // filter
       const queryObj = {...req.query}
       const excludefields = ["page", "sort","limit","fields"]
        excludefields.forEach((e)=>delete queryObj[e])
      let queryString = JSON.stringify(queryObj)
      queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (match)=> `$${match}`)
    

      let query =  Product.find(JSON.parse(queryString));
    
      // sorting
     
      if(req.query.sort) {
        
        const sortBy = req.query.sort.split(",").join(" ")

        query =  query.sort(sortBy)
            
      } else {
        query =  query.sort('-createdAt')
      }
     
      // fields
      if(req.query.fields) {
      const fields = req.query.fields.split(",").join(" ")
      query =  query.select(fields) } else {
        query =  query.select('-__v')
      }
     
      // pagination
      if(req.query.page &&req.query.limit) {
        const page = req.query.page
        const limit = req.query.limit

        const skip = (page - 1)*limit
      
        const countP = await Product.countDocuments()
        console.log(page, limit,skip + "\n" + countP);
       if(skip>=countP) {
        return next(createError(404, "No Page Found"));
       }
        query =  query.skip(skip).limit(limit)


        }


      const products = await query
      if (!products) {
        return next(createError(404, "No Products"));
      }
  
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  };

  const deleteProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (!isObjectId(id)) {
        return next(createError(404, "Id is Incorrect"));
      }
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return next(createError(404, "No Product Found"));
      }
  
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

module.exports = {createProduct,updateProduct,deleteProduct, getaProduct, getProducts}