const Cart=require('../model/cartSchema')


const cartCount=async(req,res,next)=>{
    if(!req.user){
        res.locals.cartCount=0;
        return next()
    }
    try{
    const user=req.user.userid
    const cart=await Cart.findOne({user:user})
    
  const totalItems=cart?.item.reduce((sum,item)=>sum+ item.quantity,0)||0
    res.locals.cartCount=totalItems
    next()
    }catch(err){
        console.log('cart count error',err)
    }

}

module.exports=cartCount