import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const hbsRouter = Router();
const productManager = new ProductManager();

hbsRouter.get("/", async (req, res) => {
  const products = await productManager.readAllProducts();

  return res.render("home", {
    productList: products,
    productsHeader: Object.keys(products[1]),
    productsData: products,
  });
});

hbsRouter.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.readAllProducts();

  return res.render("realTimeProducts", {
    productsHeader: Object.keys(products[1]),
    productsData: products,
  });
});

export default hbsRouter;
