// const mongoose = require("mongoose");

// const SizeSchema = new mongoose.Schema(
//   {
//     size: String,
//   },
//   { _id: false }
// );

// const ColorSchema = new mongoose.Schema(
//   {
//     color: String,
//     image: String,
//     url: String,
//   },
//   { _id: false }
// );

// const ProductSchema = new mongoose.Schema(
//   {
//     brandName: String,
//     productName: String,

//     price: Number,
//     mrp: Number,
//     discount: String,

//     images: [String],

//     sizes: [SizeSchema],

//     colors: [ColorSchema],

//     description: [String],

//     sizeFit: String,

//     specifications: {
//       type: Map,
//       of: String,
//     },

//     productCode: {
//       type: String,
//       unique: true,
//       index: true,
//     },

//     offers: [String],

//     url: String,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("MyntraProduct", ProductSchema);

const mongoose = require("mongoose");

const SizeSchema = new mongoose.Schema(
  {
    size: String,
    price: Number
  },
  { _id: false }
);

const ColorSchema = new mongoose.Schema(
  {
    color: String,
    image: String,
    url: String,
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    brandName: String,
    productName: String,

    price: Number,
    mrp: Number,
    discount: String,

    rating: Number,

    images: [String],

    sizes: [SizeSchema],

    colors: [ColorSchema],

    description: [String],

    sizeFit: String,

    specifications: {
      type: Map,
      of: String,
    },

    productCode: {
      type: String,
      unique: true,
      index: true,
    },

    offers: [String],

    url: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("MyntraProduct", ProductSchema);
