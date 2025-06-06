const Category=require('../model/categorySchema')
const jwt=require('jsonwebtoken');
const Product=require('../model/productSchema')
const Wishlist=require('../model/wishlistSchema');
const Review=require('../model/reviews')
const Order=require('../model/orderSchema')
const createCategory=async(req,res)=>{
    try{
        console.log('Rendering addcategory page');
        res.render('admin/addcategory')
    }catch(err){
        console.log('error rendoring categories page',err)
        res.status(500).send('error loading page')
    }
}



const addCategory=async(req,res)=>{
    try{
        const {name}=req.body;
        const  newCategory=new Category({name})
        await newCategory.save()
        res.redirect('/admin/addcategory')
    }catch(err){
        console.log('error creating category',err)
        res.status(500).send('error creating category')

    }
}


const getAddProduct=async(req,res)=>{
    try{
        const categories=await Category.find()
        res.render('admin/addProduct',{categories})
    }catch(err){
        console.log('error rendering product page',err)
        res.status(500).send('error loading product page')
    }
}

// Handle Product Creation
const addProduct = async (req, res) => {
    try {

        
    
      const { name, description, price, category,color } = req.body;
       const imageUrl = req.files.map(file => file.path);// Cloudinary returns `path`
  
  
      const newProduct = new Product({
        name,
        description,
        price,
        category,
        color,
        image: imageUrl,
      });
  
      await newProduct.save();
      console.log('Product saved successfully:', newProduct);
  
      res.redirect('/admin/productManagement');
    } catch (err) {
      console.error('Error adding product:', (JSON.stringify(err)));
        res.status(500).send(JSON.stringify(err));
    }
  };
  
  


const getproducts=async(req,res)=>{
    try{
        const products=await Product.find().populate('category')
       
        res.render('admin/productManagement',{products}) // ✅ correct


    }catch(err){
        console.log('error fetching products',err)
        res.status(500).send('error loading products')

    }
}




const geteditproduct=async(req,res)=>{
    try{
        const productId=req.params.id;
       const product= await Product.findById(productId)
       if (!product) {
      return res.status(404).send('Product not found');
    }
        const categories=await Category.find()
        res.render('admin/editproduct',{product,categories})
    }catch(err){
        console.log('error loading edit product page')
        res.status(500).send('error loading edit page')

    }
}


const updateproduct=async(req,res)=>{
    try{
        const productId = req.params.id;

        const{name,description,price,category,color}=req.body;
const updateData={
    name,
    description,
    price,
    category,
    color
}
if (req.files && req.files.length > 0) {
      updateData.image = req.files.map(file => file.path); //update images if new files uploaded
    }

await Product.findByIdAndUpdate(productId,updateData)
  res.redirect('/admin/productManagement')
    }catch(err){
        console.log('error product update',err)
        res.status(500).send('error update product')
    }

}



const deleteproduct=async(req,res)=>{
    try{
        const productId=req.params.id;
        await Product.findByIdAndDelete(productId)
        console.log('product deleted')
        res.redirect('/admin/productManagement')
    
    }catch(err){
        console.log('error deleting product',err)
        res.status(500).send('error deleting product')
    }
}

const getShopProducts=async(req,res)=>{
    try{
        const {sort,category}=req.query;
        // Build filter
        let filter={}
        if(category){
            filter.category=category
        }
         // Build sort option
         let sortOption={}
         if(sort==='asc'){
            sortOption.price=1
         }else if(sort==='desc'){
            sortOption.price=-1
         }
        const products=await Product.find(filter).populate('category').sort(sortOption)
         // Fetch categories for filters
         const categories=await Category.find()
        
        // Initialize wishlistItems as an empty array
       let wishlistItems=[]
        // If user is logged in, fetch the wishlist
        if(req.user){
            const wishlist=await Wishlist.findOne({user:req.user.userid}).populate('products')
            if(wishlist){
                wishlistItems=wishlist.products.map(product=>product._id.toString())
            }
        }
        res.render('user/shop',{products,user:req.user,wishlistItems,categories,selectedCategory:category||'',selectedSort:sort||''})
    }catch(err){
        console.log('error loading shop products',err)
        res.status(500).send('error laoding shop page')
    }
}

const viewProductdetails=async(req,res)=>{
    try{
    
        const productId=req.params.id
        const product=await Product.findById(productId).populate('category').populate('reviews.Review')

        if(!product){
            return res.status(400).send('product not found')
        }
        let wishlistItems=[]
        if(req.user){
            const wishlist=await Wishlist.findOne({user:req.user.userid}).populate('products')
            if(wishlist){
                wishlistItems=wishlist.products.map(product=> product._id.toString())
            }
        }

        res.render('user/viewproduct',{product,user:req.user||null,wishlistItems})
    }catch(err){
        console.log('error loading product details',err)
         res.status(400).send('error loading view product page')
    }
}


const getSearchShopItems=async(req,res)=>{
    const {search}=req.body
    try{
       const products= await Product.find({name:{$regex:search,$options:"i"}});
        const categories=await Category.find()
        let wishlistItems=[]
        // If user is logged in, fetch the wishlist
        if(req.user){
            const wishlist=await Wishlist.findOne({user:req.user.userid}).populate('products')
            if(wishlist){
                wishlistItems=wishlist.products.map(product=>product._id.toString())
            }
        }
        res.render('user/shop',{products,user:req.user,wishlistItems,categories,selectedCategory:'',selectedSort:''})

    }catch(err){
        console.log("Search error:", err);
        res.status(500).send("Error searching products");

    }
}

const createReview=async(req,res)=>{
    try{
        const productId=req.params.id
        const{rating,comment}=req.body
        const userId=req.user._id || req.user.id || req.user.userid;

        const hasPurchased=await Order.exists({
            user:userId,
            'items.product':productId,// assuming items is an array in the order
            status:'delivered'
        })

        if(!hasPurchased){
            return res.status(403).json({message:'you can only review products you have purchased'})
        }
        //check if user has already reviewed
        const existingReview=await Review.findOne({user:userId,product:productId})
        if(existingReview){
            return res.status(400).json({message:"you have already reviewd this product"})
        }
        //Create the review
        const review=new Review({
            user:userId,
            product:productId,
            rating,
            comment
        })
        await review.save()
        await Product.findByIdAndUpdate(productId,{
            $push:{reviews:review._id}
        })
        res.status(200).redirect('viewproduct')
    }catch(err){
        console.error(err)
        res.status(500).json({message:'server error'})
    }
}
module.exports={createCategory,addCategory,getAddProduct,addProduct ,getproducts,deleteproduct,geteditproduct,updateproduct,getShopProducts,viewProductdetails,getSearchShopItems,createReview}