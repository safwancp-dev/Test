
const jwt=require('jsonwebtoken')
const Cart=require('../model/cartSchema')
const Product=require('../model/productSchema')
const User=require('../model/userSchema')


const addCart=async(req,res)=>{
    try{

        const productId=req.params.id;  
        const userId=req.user.userid
        console.log(req.user)
       
      
       
      const product=await Product.findById(productId)
      if(!product){

        return res.status(404).json({success:false,message:'product not found'})

      }
      

      let cart=await Cart.findOne({user:userId})
      if(!cart){
         // No cart exists, create new one
        cart=new Cart({
            user:userId,
            item:[{product:productId,quantity:1}]

        })
      }else{
         // Cart exists, check if product already in cart
         const itemExits=cart.item.find(item=>item.product.toString()===productId)
         if(itemExits){
            console.log('item already in cart')
            return res.status(409).json({success:false,message:'item already in  cart'})
         }
         // Add new item to cart
         cart.item.push({product:productId,quantity:1})
      }

      await cart.save()
      console.log('item added in cart');
      res.status(200).json({success:true,message:'item added to cart'})
      
    }catch(err){
        console.log('error adding product',err)
        res.status(400).json({success:false,message:'error adding to cart'})
        

    }
}

const getCartPage=async(req,res)=>{
  try{
      if (!req.user) {
      // Handle unauthenticated user
      if (req.xhr) {
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        return res.redirect("/login");
      }
    }
  const userId=req.user.userid
  
  const cart=await Cart.findOne({user:userId}).populate('item.product')
    if(!cart){
      return res.render('user/cart',{cart:null,user:req.user,totalamount:0})
    }
    // Remove items where the product no longer exists
    cart.item=cart.item.filter(item=>item.product !==null)

    await cart.save()// Optionally update the cart in DB
  const totalamount=cart.item.reduce((total,item)=>{
    return total+item.quantity*item.product.price;
  },0)
  
  res.render('user/cart',{cart,user:req.user,totalamount})
  }catch(err){
    console.log('error laoding cart',err)
    res.redirect('/shop')
    
  }
}

const updateQuantity=async(req,res)=>{
  try{
    const userId=req.user.userid
    const productId=req.params.id
    const action=req.body.action   //increment or decrement

    const cart=await Cart.findOne({user:userId}).populate('item.product')
       if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });


      const item=cart.item.find(i=>i.product._id.toString()===productId)

      if(item){
        if(action==='increment'){
          item.quantity +=1

        }else if(action==='decrement'){
          if(item.quantity >1){
            item.quantity -=1
          }else{
            // Remove item if quantity becomes 0 or 1 (based on your preference)
            cart.item=cart.item.filter(i=>i.product._id.toString()!==productId)     
          }
        }
    
      }
        await Cart.updateOne({ _id: cart._id }, { item: cart.item });

      const total=cart.item.reduce((sum,i)=>sum +(i.product.price*i.quantity),0);
       // Check if item still exists in cart after update
    
      const  itemExist=cart.item.find(i=>i.product._id.toString()===productId)
    res.json({
     success:true,
     quantity:itemExist?itemExist.quantity:0,
     subtotal:itemExist?itemExist.product.price*itemExist.quantity:0,
     totalAmount:total,
     removed:!itemExist
    });
  }

catch(err){
  console.log('error updating quantity',err)
  return res.status(500).json({ success: false, message: 'Server error' });
}
}

const removeCartitem=async(req,res)=>{
  try{
    const userId=req.user.userid
    const productId=req.params.id
    if(!userId){
      return res.status(401).json({success:false,message:'user not loggedin'})
    }
    const cart=await Cart.findOne({user:userId})
    if(!cart){
      return res.status(401).json({success:false,message:'cart not found'})
    }
      // Filter out the item to remove
      cart.item=cart.item.filter(item=>item.product.toString() !==productId)

      await cart.save()
      res.redirect('/cart')

  }catch(err){
    console.log('error removing cart')
    res.status(500).send('error removing cart')
  }
}

const getCheckoutPage=async(req,res)=>{
  try{
    
  const userId=req.user.userid;
  const user= await User.findById(userId)
 
  const cart=await Cart.findOne({user:userId}).populate('item.product')
  if(!cart||cart.item.length===0){
    return res.redirect('/cart')
  }
     // Clean invalid products if any
     cart.item=cart.item.filter(item=>item.product!==null)
     await cart.save()

     const totalAmount=cart.item.reduce((total,item)=>{
      return total+item.quantity*item.product.price;
     },0)
     res.render('user/checkoutpage',{user:req.user,cartItems:cart.item,totalAmount,message:'',addresses:user.addresses||[]})
  }catch(err){
console.log('error loading checkou page',err)
return res.status(500).send('error loading checkoutpage')
  }
}






module.exports={addCart,getCartPage,updateQuantity,getCheckoutPage,removeCartitem}