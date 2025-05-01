
const jwt=require('jsonwebtoken')
const Cart=require('../model/cartSchema')
const Product=require('../model/productSchema')
const User=require('../model/userSchema')


const addCart=async(req,res)=>{
    try{
        const token = req.cookies.token;
    if(!token){
        return res.redirect('/login')    }
        
        
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user=await User.findById(decoded.userid)

        const productId=req.params.id;

        if (!user.cart) user.cart = []; 

        const index=user.cart.findIndex(item=>item.product.toString()===productId)
        if(index!=-1){
            user.cart[index].quantity +=1
        }else{
            user.cart.push({product:productId,quantity:1})
        }
        
        await user.save()
        console.log('added in the cart')
        res.redirect('/shop')

    }catch(err){
        console.log('error adding product',err)
        res.redirect('/login')
        

    }
}

module.exports={addCart}