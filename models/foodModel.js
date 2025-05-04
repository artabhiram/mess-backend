// import mongoose from "mongoose";

// const foodSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true},
//     image: { type: String, required: true },
//     category:{ type:String, required:true},
//     mess: {type:String,required:true}
// })

// const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
// export default foodModel;

import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    mess: { type: String, required: true },

    // Reviews as an array of objects
    reviews: { type: Array, required: true },

    // Average rating
    averageRating: { type: Number, default: 0 },

    // Dynamic pricing toggle
    dynamicPricing: { type: Boolean, default: false }
});

// Create a method to calculate average rating when a review is added
foodSchema.methods.calculateAverageRating = function () {
    const totalRatings = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = this.reviews.length > 0 ? totalRatings / this.reviews.length : 0;
    this.averageRating = average;
    return this.save();
};

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
export default foodModel;
