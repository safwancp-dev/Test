const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)
const Cart=require('../model/cartSchema')
const Order=require('../model/orderSchema')
const Coupon=require('../model/couponSchema')
const User=require('../model/userSchema')
const couponSchema = require('../model/couponSchema')


const applyCoupon=async(req,res)=>{
  try{
    const {code,totalAmount}=req.body  // Getting the coupon code and total from the user
    const userId=req.user.userid

    const coupon=await Coupon.findOne({code:couponCode.toUpperCae()}); // Search the coupon
    if(!coupon) return res.json({success:false,message:'invalid coupon code'})

    if(new Date(coupon.expiryDate)<new Date())
      return res.json({success:false,message:'expired coupon code'})

    if(coupon.usedBy.includes(userId))
      return res.json({success: false,message:'coupon already used'})

    if(totalAmount < coupon.minPurchaseAmount)
      return res.json({success:false,message:`Minimum purchase ₹${coupon.minPurchaseAmount} required`})
     // Calculate discount
     let discount=coupon.discountType ==='percentage' ?(coupon.discountValue)*totalAmount :coupon.discountValue;
     const newTotal=totalAmount-discount

     return res.json({
      success:true,
      message:'coupon applied',
      discount,
      newTotal,
      couponCode:coupon.code,
     })
  }catch(err){
    console.error('error coupon applying',err)
    res.status(400).json({success:false,message:'error applying coupon'})
  }
}
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.userid;  // consistent user id
    const user = await User.findById(userId);
 const { addressId, couponCode, paymentMethod } = req.body;

const selectedAddress=  {
   // from form input
   
    address: addressId.address,
    city: addressId.city,
    postalCode: addressId.postalCode,
    phone: addressId.phone

}

    const cart = await Cart.findOne({ user: userId }).populate('item.product');
    if (!cart || cart.item.length === 0) {
      return res.redirect('/cart');
    }

    // Calculate total amount before discount
    let totalAmount = cart.item.reduce(
      (total, item) => total + item.quantity * item.product.price, 0
    );

    let discount = 0;
    let coupon = null;

    // Validate and apply coupon if present
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (
        coupon &&
        new Date(coupon.expiryDate) > new Date() &&
        totalAmount >= coupon.minPurchaseAmount &&
        !coupon.usedBy.includes(userId)
      ) {
        discount = coupon.discountType === 'percentage'
          ? (coupon.discountValue / 100) * totalAmount
          : coupon.discountValue;

        if (discount > totalAmount) discount = totalAmount;  // safety check

        totalAmount -= discount;
      } else {
        coupon = null;
      }
    }

    if (paymentMethod === 'Online') {
       req.session.shippingAddress = selectedAddress;
       
      // Create Stripe session with ONE line item representing the total after discount
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{
          price_data: {
            currency: 'inr',
            product_data: { name: 'Order Total' },
            unit_amount: Math.round(totalAmount * 100),  // total in paise
          },
          quantity: 1,
        }],
        success_url: `${req.protocol}://${req.get('host')}/payment-success?session_id={CHECKOUT_SESSION_ID}&coupon=${coupon?.code || ''}`,
        cancel_url: `${req.protocol}://${req.get('host')}/checkout`,
      });


      // Coupon usage marked only after successful payment in paymentSuccess route

      return res.redirect(session.url);
    }

    // Cash on Delivery order
    const codOrder = new Order({
      user: userId,
      items: cart.item.map(i => ({
        product: i.product._id,
        quantity: i.quantity,
      })),
      shippingAddress: selectedAddress,
      paymentMethod,
      discount,
      totalAmount,
      paymentStatus: 'pending',
    });

    await codOrder.save();

    if (coupon) {
      coupon.usedBy.push(userId.toString());
      await coupon.save();
    }

    await Cart.findOneAndDelete({ user: userId });

    const populatedOrder = await Order.findById(codOrder._id).populate('items.product');
    return res.render('user/order-summary', { order: populatedOrder });

  } catch (err) {
    console.error('Error placing order', err);
    return res.redirect('/cart');
  }
};

const paymentSuccess=async(req,res)=>{
  try{
  const {session_id,coupon}=req.query
  const session=await stripe.checkout.sessions.retrieve(session_id)
  const userId=req.user.userid
  const cart=await Cart.findOne({user:userId}).populate('item.product')
  if(!cart)return res.redirect('/cart')

     // Get original total
     let totalAmount=cart.item.reduce((total,item)=>total+item.quantity*item.product.price,0)
     let discount=0
     let couponDoc=null

     if(coupon){
      
       couponDoc = await Coupon.findOne({ code: coupon.toUpperCase() });
      if(coupon&&new Date(couponDoc.expiryDate)>new Date()&&
    totalAmount>=couponDoc.minPurchaseAmount&&!couponDoc.usedBy.includes(userId)
  ){
    discount=couponDoc.discountType==='percentage'
    ?(couponDoc.discountValue /100)*totalAmount
    :couponDoc.discountValue
    if(discount>totalAmount)discount=totalAmount;
    totalAmount-=discount

  }
     }else{
      couponDoc=null
     }
      //  Ensure shipping address exists
    const shippingAddress = req.session.shippingAddress;
    if (!shippingAddress) {
      console.error('Missing shipping address in session');
      return res.redirect('/checkout?message=Missing+shipping+info');
    }
    // 🧾 Create the order only after successful payment
          const order = new Order({
        user: userId,
        items: cart.item.map(i => ({
          product: i.product._id,
          quantity: i.quantity,
        })),
        shippingAddress: req.session.shippingAddress, 
        paymentMethod:'Online',
        totalAmount,
        discount,
        paymentStatus: 'paid',  // will update to 'paid' on payment success
        stripeSessionId: session.id,
      });

      await order.save();
      if(couponDoc){
        couponDoc.usedBy.push(userId.toString())
        await couponDoc.save()
      }
      await Cart.findOneAndDelete({ user: userId });

    const populatedOrder = await Order.findById(order._id).populate('items.product');
    return res.render('user/payment-success', { order: populatedOrder });
  }catch(err){
    console.error('payment success error',err)
    res.redirect('/home')
  }
}

const viewOrders=async(req,res)=>{
  try{

    const userId=req.user.userid

    const orders=await Order.find({user:userId})
    .sort({createdAt:-1})
    .populate('items.product')
    res.render('user/vieworders',{orders,user:userId})
  }catch(err){
    console.error('Error fetching orders:', err);
    res.redirect('/home');
  }
}

const cancelOrder=async(req,res)=>{
try{
  const userId=req.user.userid
  const orderId=req.params.id
  const order=await Order.findOne({_id:orderId,user:userId})
  if(!order){
    return res.redirect('/view-orders?message=Order not found&type=error')
  }

  if(order.status==='cancelled'){
    return res.redirect('/view-orders?message=Order is already cancelled&type=info')
  }
  // If the order was paid via online method, refund via Stripe
  if(order.paymentMethod==='Online'&&order.paymentStatus==='paid'){
    const session=await stripe.checkout.sessions.retrieve(order.stripeSessionId)

    if(!session.payment_intent){
      console.error('missing payment_intent in stripe session')
      return res.redirect('/view-orders?message=Unable to refund. Contact support&type=error')
    }
     // Issue refund
     await stripe.refunds.create({
      payment_intent:session.payment_intent,
     })
     order.paymentStatus='refunded';
  }
  order.status='cancelled'
  await order.save()
  res.redirect('/view-orders')
}catch(err){
  console.error('Error cancelling order:', err);
    return res.redirect('/view-orders?message=Something went wrong&type=error');
}
}

module.exports={placeOrder,viewOrders,paymentSuccess,cancelOrder,applyCoupon}