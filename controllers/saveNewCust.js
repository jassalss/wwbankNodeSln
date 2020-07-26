const { validationResult } = require("express-validator/check");

const DB = require("../firebaseConfig/firebase");
let realTimeDB = DB.realTimeDB;
let Converter = require("./helper");
const saveNewCustomer = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      console.log(errors.array());
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }
    let body = req.body;
    let amount = body.balance;
    let currencyType = body.currencyType;
    let otherCurrency = "";
    if (currencyType !== "CAD") {
      otherCurrency = ` = $${amount} ${currencyType}`;
      amount = Converter(amount, currencyType);
    }
    let customerObj = {
      AccountNumber: body.accountNumber,
      Balance: amount,
      CustomerId: body.customerId,
      CustomerName: body.customerName,
    };
    const eventref = realTimeDB.ref(
      `allNodeAccounts/${customerObj.AccountNumber}`
    );
    const snapshot = await eventref.once("value");
    var message = "Account Already exist. Please use another Account Number";

    if (!snapshot.exists()) {
      await realTimeDB
        .ref(`allNodeAccounts/${customerObj.AccountNumber}`)
        .set(customerObj);
      res.status(201).json({
        message: `New Account Created Sucessfully With balance $${customerObj.Balance} CAD ${otherCurrency}`,
      });
    } else {
      res.status(201).json({
        message,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
module.exports = saveNewCustomer;
// exports.getPosts = async (req, res, next) => {
//   const currentPage = req.query.page || 1;
//   const perPage = 2;
//   let totalItems;
//   try {
//     const totalItems = await Post.find().countDocuments();
//     const posts = await Post.find()
//       .skip((currentPage - 1) * perPage)
//       .limit(perPage);

//     res.status(200).json({
//       message: "Fetched posts successfully.",
//       posts: posts,
//       totalItems: totalItems,
//     });
//   } catch (error) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.createPost = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error("Validation failed, entered data is incorrect.");
//     error.statusCode = 422;
//     throw error;
//   }
//   if (!req.file) {
//     const error = new Error("No image provided.");
//     error.statusCode = 422;
//     throw error;
//   }
//   const imageUrl = req.file.path;
//   const title = req.body.title;
//   const content = req.body.content;
//   let creator;
//   const post = new Post({
//     title: title,
//     content: content,
//     imageUrl: imageUrl,
//     creator: req.userId,
//   });
//   post
//     .save()
//     .then((result) => {
//       return User.findById(req.userId);
//     })
//     .then((user) => {
//       creator = user;
//       user.posts.push(post);
//       return user.save();
//     })
//     .then((result) => {
//       res.status(201).json({
//         message: "Post created successfully!",
//         post: post,
//         creator: { _id: creator._id, name: creator.name },
//       });
//     })
//     .catch((err) => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

// exports.getPost = (req, res, next) => {
//   const postId = req.params.postId;
//   Post.findById(postId)
//     .then((post) => {
//       if (!post) {
//         const error = new Error("Could not find post.");
//         error.statusCode = 404;
//         throw error;
//       }
//       res.status(200).json({ message: "Post fetched.", post: post });
//     })
//     .catch((err) => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

// exports.updatePost = (req, res, next) => {
//   const postId = req.params.postId;
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error("Validation failed, entered data is incorrect.");
//     error.statusCode = 422;
//     throw error;
//   }
//   const title = req.body.title;
//   const content = req.body.content;
//   let imageUrl = req.body.image;
//   if (req.file) {
//     imageUrl = req.file.path;
//   }
//   if (!imageUrl) {
//     const error = new Error("No file picked.");
//     error.statusCode = 422;
//     throw error;
//   }
//   Post.findById(postId)
//     .then((post) => {
//       if (!post) {
//         const error = new Error("Could not find post.");
//         error.statusCode = 404;
//         throw error;
//       }
//       if (post.creator.toString() !== req.userId) {
//         const error = new Error("Not authorized!");
//         error.statusCode = 403;
//         throw error;
//       }
//       if (imageUrl !== post.imageUrl) {
//         clearImage(post.imageUrl);
//       }
//       post.title = title;
//       post.imageUrl = imageUrl;
//       post.content = content;
//       return post.save();
//     })
//     .then((result) => {
//       res.status(200).json({ message: "Post updated!", post: result });
//     })
//     .catch((err) => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

// exports.deletePost = (req, res, next) => {
//   const postId = req.params.postId;
//   Post.findById(postId)
//     .then((post) => {
//       if (!post) {
//         const error = new Error("Could not find post.");
//         error.statusCode = 404;
//         throw error;
//       }
//       if (post.creator.toString() !== req.userId) {
//         const error = new Error("Not authorized!");
//         error.statusCode = 403;
//         throw error;
//       }
//       // Check logged in user
//       clearImage(post.imageUrl);
//       return Post.findByIdAndRemove(postId);
//     })
//     .then((result) => {
//       return User.findById(req.userId);
//     })
//     .then((user) => {
//       user.posts.pull(postId);
//       return user.save();
//     })
//     .then((result) => {
//       res.status(200).json({ message: "Deleted post." });
//     })
//     .catch((err) => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

// const clearImage = (filePath) => {
//   filePath = path.join(__dirname, "..", filePath);
//   fs.unlink(filePath, (err) => console.log(err));
// };