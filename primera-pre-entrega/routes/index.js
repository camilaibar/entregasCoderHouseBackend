const { Router } = require("express");
const productRouter = require("./v1/productRouter");
const cartRouter = require("./v1/cartRouter");

const router = Router();

router.use("/products/v1", productRouter);
router.use("/carts/v1", cartRouter);

module.exports = router;
