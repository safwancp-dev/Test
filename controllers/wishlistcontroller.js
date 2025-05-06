const jwt=require('jsonwebtoken')
const Wishlist=require('../model/wishlistSchema')
const Product=require('../model/productSchema')


const addTwowishlist=async(req,res)=>{
    try{
        const userId=req.user.userid
        const productId=req.params.id

        let wishlist=await Wishlist.findOne({user:userId})
        if(!wishlist){
            wishlist=new Wishlist({user:userId,products:[productId]})
        }else{
            const exits=wishlist.products.includes(productId)
            if(exits){
                return res.status(400).send('product already in wishlist')
            }
            wishlist.products.push(productId)
        }
        await wishlist.save()
        res.redirect('/shop')
    }catch(err){
        console.log('Error adding to wishlist:', err);
    res.status(500).send('Error adding to wishlist');
    }
}

const removeFromwishlist=async(req,res)=>{
    try{
        const userId=req.user.userid
        const productId=req.params.id

        await Wishlist.updateOne({user:userId},{$pull:{products:productId}})
        res.redirect('/wishlist')
    }catch(err){
        console.log('error removing from wishlist',err)
        res.status(400).send('error removing from wishlist')
    }
}


const getWishlist=async(req,res)=>{
    try{
    const userId=req.user.userid
    const wishlist=await Wishlist.findOne({user:userId}).populate('products')
    if(!wishlist){
        return res.render('user/wishlist')
    }
    res.render('user/wishlist',{user:req.user,wishlist:wishlist.products})
    }catch(err){
        console.log("error fetching wishlist",err)
        res.redirect('/login')
    }
}
module.exports={addTwowishlist,removeFromwishlist,getWishlist}