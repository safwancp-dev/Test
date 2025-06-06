
const Wishlist = require("../model/wishlistSchema");


const addTowishlist = async (req, res) => {
  try {
     if (!req.user) {
      // Handle unauthenticated user
      if (req.xhr) {
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        return res.redirect("/login");
      }
    }
    const userId = req.user.userid;
    const productId = req.params.id;

    let wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else {
      const exists = wishlist.products.some(
        (p) => p.toString() === productId.toString()
      );

      if (exists) {
        return res.status(400).json({success:false,message:"product already in wishlist"});
      }
      wishlist.products.push(productId);
    }
    await wishlist.save();
    res.status(200).json({success:true,message:'Added to wishlist'})
  } catch (err) {
    console.log("Error adding to wishlist:", err);
    res.status(500).json({success:false,message:"Error adding to wishlist"});
  }
};

const removeFromwishlist = async (req, res) => {
  try {
    const userId = req.user.userid;
    const productId = req.params.id;

    await Wishlist.updateOne(
      { user: userId },
      { $pull: { products: productId } }
    );
    res.status(200).json({success :true,message:'removed from wishlist'})
  } catch (err) {
    console.log("error removing from wishlist", err);
    res.status(400).json({success:false,message:"error removing from wishlist"});
  }
};

const getWishlist = async (req, res) => {
  try {
      if (!req.user) {
      // Handle unauthenticated user
      if (req.xhr) {
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        return res.redirect("/login");
      }
    }
    const userId = req.user.userid;
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products"
    );

    res.render("user/wishlist", {
      user: req.user,
      wishlist: wishlist.products,
    });
  } catch (err) {
    console.log("error fetching wishlist", err);
    res.redirect("/shop");
  }
};
module.exports = { addTowishlist, removeFromwishlist, getWishlist };
