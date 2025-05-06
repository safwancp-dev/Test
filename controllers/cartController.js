
const jwt=require('jsonwebtoken')
const Cart=require('../model/cartSchema')
const Product=require('../model/productSchema')



const addCart=async(req,res)=>{
    try{
        const productId=req.params.id;
        const userId=req.user.userid
        console.log(req.user)
       
      if(!userId){
        return res.status(401).json('user not logged in')

      }
      const product=await Product.findById(productId)
      if(!product){
        return res.status(401).send('product not found')

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
            return res.status(404).json('item already in  cart')
         }
         // Add new item to cart
         cart.item.push({product:productId,quantity:1})
      }

      await cart.save()
      console.log('item added in cart')
      res.redirect('/shop')
    }catch(err){
        console.log('error adding product',err)
        res.redirect('/login')
        

    }
}

const getCartPage=async(req,res)=>{
  try{
  const userId=req.user.userid
  
  const cart=await Cart.findOne({user:userId}).populate('item.product')
  const totalamount=cart.item.reduce((total,item)=>{
    return total+item.quantity*item.product.price;
  },0)
  
  res.render('user/cart',{cart,user:req.user,totalamount})
  }catch(err){
    console.log('error laoding cart',err)
    res.redirect('/login')
    
  }
}

const updateQuantity=async(req,res)=>{
  try{
    const userId=req.user.userid
    const productId=req.params.id
    const action=req.body.action   //increment or decrement

    const cart=await Cart.findOne({user:userId}).populate('item.product')
    if(!cart) return res.redirect('/cart')


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
        await cart.save()
      }
      res.redirect('/cart')
  }

catch(err){
  console.log('error updating quantity',err)
  res.redirect('/cart')
}
}
module.exports={addCart,getCartPage,updateQuantity}