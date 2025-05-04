import foodModel from "../models/foodModel.js";
import fs from 'fs'
import { ObjectId } from "mongodb";

// all food list
import orderModel from '../models/orderModel.js';

const listFood = async (req, res) => {
  try {
    // Fetch all foods for the mess
    const foods = await foodModel.find({ mess: req.body.messId });

    // Define start and end of today using the 'date' field
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch today's orders for this mess
    const todaysOrders = await orderModel.find({
      mess: req.body.messId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // Compute total sales per food item
    const salesMap = {};
    todaysOrders.forEach(order => {
      order.items.forEach(item => {
        const id = item.foodId || item._id; // Depending on how you store it
        if (!salesMap[id]) salesMap[id] = 0;
        salesMap[id] += item.quantity;
      });
    });

    // Build updated food list with dynamic pricing
    const updatedFoodList = foods.map(food => {
      const soldToday = salesMap[food._id.toString()] || 0;
      let updatedPrice = food.price;

      // Example dynamic pricing logic
      if (food.dynamicPricing) {
        if (soldToday >= 20) {
          updatedPrice = Math.round(food.price * 1.2); // 20% increase
        } else if (soldToday >= 10) {
          updatedPrice = Math.round(food.price * 1.1); // 10% increase
        } else if (soldToday < 3) {
          updatedPrice = Math.round(food.price * 0.9); // 10% discount
        }
      }

      return {
        ...food._doc,
        price: updatedPrice,
        soldToday // Optional: return this too
      };
    });

    res.json({ success: true, data: updatedFoodList });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching food list" });
  }
};

// add food
const addFood = async (req, res) => {

    try {
        let image_filename = `${req.file.filename}`

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category:req.body.category,
            image: image_filename,
            mess: req.body.messId,
        })

        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// delete food
const removeFood = async (req, res) => {
    try {

        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => { })

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Food Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

// addReviewToFood
const addReviewToFood = async (req, res) => {
    try {        
        const { foodId, name, comment, rating } = req.body;

        if (!foodId || !name || !comment || typeof rating !== 'number') {
            return res.status(400).json({ success: false, message: "Missing or invalid fields" });
        }

        const food = await foodModel.findById(foodId);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        // Add the review
        const newReview = {
            name,
            comment,
            rating,
            date: new Date()
        };

        food.reviews.push(newReview);

        // Use schema method to recalculate average
        await food.calculateAverageRating();

        res.json({
            success: true,
            message: "Review added",
            averageRating: food.averageRating,
            reviews: food.reviews
        });

    } catch (error) {
        console.error("Add Review Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// // Update price of a specific food item
// const updateFoodPrice = async (req, res) => {
//     try {
//       const { foodId, newPrice } = req.body;
  
//       // Find the food item by ID
//       const foodItem = await foodModel.findById(foodId);
  
//       if (!foodItem) {
//         return res.status(404).json({ success: false, message: "Food item not found" });
//       }
  
//       // Update the price of the food item
//       foodItem.price = newPrice;
  
//       await foodItem.save();
  
//       res.status(200).json({
//         success: true,
//         message: `Price for ${foodItem.name} updated to ${newPrice}`,
//         foodItem
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: "Error updating food price" });
//     }
//   };

const toggleDynamicPricing = async (req, res) => {
    try {
      const { foodId } = req.body;
  
      // Find the food item
      const foodItem = await foodModel.findById(foodId);
      if (!foodItem) {
        return res.status(404).json({ success: false, message: 'Food item not found' });
      }
  
      // Toggle the dynamicPricing field
      foodItem.dynamicPricing = !foodItem.dynamicPricing;
      await foodItem.save();
  
      res.status(200).json({ 
        success: true, 
        message: `Dynamic pricing ${foodItem.dynamicPricing ? 'enabled' : 'disabled'} for ${foodItem.name}`,
        data: foodItem
      });
  
    } catch (error) {
      console.error('Error toggling dynamic pricing:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
export { listFood, addFood, removeFood, addReviewToFood, toggleDynamicPricing }