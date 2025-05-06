const Category=require('../model/categorySchema')
const jwt=require('jsonwebtoken');
const Product=require('../model/productSchema')
const Wishlist=require('../model/wishlistSchema')
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

        console.log('error')
    
      const { name, description, price, category,color } = req.body;
      const imageUrl = req.file.path; // Cloudinary returns `path`
  
  
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
      console.error('Error adding product:', err);
      res.status(500).send('Error creating product');
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
        const categories=await Category.find()
        res.render('admin/editproduct',{product,categories})
    }catch(err){
        console.log('error loading edit product page')
        res.status(500).send('error loading edit page')

    }
}


const updateproduct=async(req,res)=>{
    try{
        const produtId=req.params.id;
        const{name,description,price,category,color}=req.body;
const updateData={
    name,
    description,
    price,
    category,
    color
}
if(req.file){
    updateData.image=req.file.path;
}

await Product.findByIdAndUpdate(produtId,updateData)
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
        const products=await Product.find().populate('category')
        
        // Initialize wishlistItems as an empty array
       let wishlistItems=[]
        // If user is logged in, fetch the wishlist
        if(req.user){
            const wishlist=await Wishlist.findOne({user:req.user.userid}).populate('products')
            if(wishlist){
                wishlistItems=wishlist.products.map(product=>product._id.toString())
            }
        }
        res.render('user/shop',{products,user:req.user,wishlistItems})
    }catch(err){
        console.log('error loading shop products',err)
        res.status(500).send('error laoding shop page')
    }
}

const viewProductdetails=async(req,res)=>{
    try{
        const productId=req.params.id
        const product=await Product.findById(productId).populate('category')
        if(!product){
            return res.status(400).send('product not found')
        }
        let wishlistItems=[]
        if(req.user){
            const wishlist=await Wishlist.findOne({user:req.user.userid}).populate('products')
            if(!wishlist){
                wishlistItems=wishlist.products.map(product=>product>_id.toString())
            }
        }

        res.render('user/viewproduct',{product,user:req.user||null,wishlistItems})
    }catch(err){
        console.log('error loading product details',err)
         res.status(400).send('error loading view product page')
    }
}

module.exports={createCategory,addCategory,getAddProduct,addProduct ,getproducts,deleteproduct,geteditproduct,updateproduct,getShopProducts,viewProductdetails}