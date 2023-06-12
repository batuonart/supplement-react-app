const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// Here, we'll be using express router.
const router = require("express").Router();

// CREATE product
router.post("/", async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        return res.status(200).json(savedProduct);
    } catch (err) {
        return res.status(500).json(err);
    }

});

// DELETE product
router.delete("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        return res.status(200).json("Product has been deleted successfully");
    } catch (err) {
        return res.status(500).json(err);
    }
})


// GET PRODUCT, users and admins can reach specific product data.
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        // Send everything but password. 
        // Send user the access token
        res.header('Content-Range', 'products 0-24/319');
        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//GET FOR ADMIN PANEL
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        // Send everything but password. 
        // Send user the access token
        res.header('Content-Range', 'products 0-24/319');
        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json(err);
    }
})


// GET ALL USERS, everyone can get all products.
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew){
            // Fetch most recent 5 products
            // To use the API localhost:5000/api/products?new=true
            //  ⟶ new?true query allows you to fetch the recent products.
            products = await Product.find().sort({createdAt: -1}).limit(1) //Change limit to 1 to change how many recent products to fetch.

        } else if (qCategory){
            // Get products by category
            products = await Product.find({categories: {
                $in: [qCategory],
            },
        });
        } else {
            // Get all products
            products = await Product.find();
        }
        products = await Product.find();
        res.header('Content-Range', 'products 0-24/319');

        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//Using $regex to find name by substr. Ex: Finding Hardline by line or ard
router.get("/findbytitle/:title", async (req, res) => {
    try {
        const product = await Product.find( {title: { $regex: req.params.title}})
        // Send everything but password. 
        // Send user the access token
        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//Using $regex to find name by substr. Ex: Finding Banana Protein Powder by Banana, protein ...
router.get("/findbydesc/:desc", async (req, res) => {
    try {
        const product = await Product.find( {desc: { $regex: req.params.desc}})
        // Send everything but password. 
        // Send user the access token
        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json(err);
    }
})


//Using $regex to find name by all. Ex: Finding Banana Protein Powder by Banana, protein ...
router.get("/findbyall/:all", async (req, res) => {

    try {
        const product = await Product.find({$or:[ {desc: { $regex: req.params.all, $options: 'i'}}, {title: { $regex: req.params.all, $options: 'i'}}]})

        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json(err);
    }
})


// UPDATE Product
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
            { new: true }
        );
        return res.status(200).json(updatedProduct);
    } catch (err) {
        return res.status(500).json(err);
    }
})

// Add Rating Product
router.put("/addrating/:id", verifyToken, async (req, res) => {
    const product = await Product.findById(req.params.id)
    let addRating = req.body.rating
    let prevRating = product.rating
    let totalrating= addRating+prevRating

    let rCount= product.ratingcount
    let incrementedRCount=rCount + 1
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            rating: totalrating,
            ratingcount: incrementedRCount
        },
            { new: true }
        );
        return res.status(200).json(updatedProduct);
    } catch (err) {
        return res.status(500).json(err);
    }
})


//It is for finding aromas of an category
router.get("/findaroma/:categories", async (req, res) => {
    try {
        const products = await Product.find({categories: req.params.categories})
        const aromaArray=[]
        for (product of products){
            for(const aromaB of product.aroma){
                if ((aromaArray.includes(aromaB.charAt(0).toUpperCase()+aromaB.slice(1)) === false)) 
                { aromaArray.push(aromaB.charAt(0).toUpperCase()+aromaB.slice(1))}
            }
        }
        return res.status(200).json(aromaArray);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//It is for sorting of an category
router.get("/sort/:categories", async (req, res) => {
    let sortType = req.body.sortType
    let sortParam = req.body.sortParam
    try {
        const products = await Product.find({categories: req.params.categories}).sort({sortParam:sortType})
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//It is for finding weight of an category
router.get("/findsize/:categories", async (req, res) => {
    try {
        const products = await Product.find({categories: req.params.categories})
        const sizeArray=[]
        for (product of products){
            if ((sizeArray.includes(product.size) === false)) 
                { sizeArray.push(product.size)}
        }
        return res.status(200).json(sizeArray);
    } catch (err) {
        return res.status(500).json(err);
    }
})
module.exports = router;
