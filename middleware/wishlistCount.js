const Wishlist=require('../model/wishlistSchema')

const wishlistCount=async(req,res,next)=>{
    if(!req.user){
        res.locals.wishlistCount=0
        return next()
    } try{
        const user=req.user.userid
        const wishlist = await Wishlist.findOne({ user: user }).populate("products");

        const totalWishlist = wishlist?.products.filter(p => p !== null).length || 0;

        res.locals.wishlistCount=totalWishlist
        next()
    }catch(err){
          console.error("Error in wishlistCount middleware:", err); // ✅ Always log errors
    res.locals.wishlistCount = 0;
    next();
    }
}

module.exports=wishlistCount