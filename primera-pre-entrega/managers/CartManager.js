const fs = require("fs");
const path = require("path");
const PRODUCTS_PATH = path.dirname("") + "/storage/carts.json";

const getExistingData = () => {
  try {
    if (fs.existsSync(PRODUCTS_PATH)) {
      const data = fs.readFileSync(PRODUCTS_PATH, "utf-8");
      if (data) return JSON.parse(data);
    } else {
      fs.writeFileSync(PRODUCTS_PATH, JSON.stringify([]), (err) =>
        console.log("Error creating carts file", error)
      );
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

const updateCartsData = () => {
  try {
    fs.writeFileSync(
      PRODUCTS_PATH,
      JSON.stringify(CartManager.cartList),
      (err) => console.log("Error creating/updating carts file", error)
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};

class CartManager {
  static cartList = getExistingData();
  static cartID = this.cartList.reduce(
    (prev, accum) => (prev > accum.cid ? prev : accum.cid), // Get the largest id generated
    0
  );

  constructor(products = []) {
    this.cid = CartManager.cartID++;
    this.products = products;
  }
}

CartManager.prototype.createCart = (products = []) => {
  const cart = new CartManager(products);
  CartManager.cartList.push(cart);
  updateCartsData();
};

CartManager.prototype.readAllCarts = () => CartManager.cartList;

CartManager.prototype.readCartByID = (cid = undefined) =>
  CartManager.cartList.find((cart) => cart.cid == cid);

CartManager.prototype.updateCartByID = (cart = {}) => {
  // Update Products From Cart
  const { cid, ...cartDetails } = cart;
  const newCart = {
    ...CartManager.cartList.find((cart) => cart.cid == cid),
    ...cartDetails,
  }; // The second object overrides the values of existing one when defined (cid cannot be overiden)

  CartManager.cartList = CartManager.cartList.map((cart) =>
    cart.cid == cid ? newCart : cart
  ); // Update cart on cart list

  updateCartsData(); // Update file
};

CartManager.prototype.deleteAllCarts = () => {
  CartManager.cartList = [];
  updateCartsData(); // Update file
};

CartManager.prototype.deleteCartByID = (cid = undefined) => {
  CartManager.cartList = CartManager.cartList.filter(
    (cart) => cart.cid !== cid
  );

  updateCartsData(); // Update file
};

CartManager.prototype.addProductToCart = (pid = undefined, cid = undefined) => {
  CartManager.cartList = CartManager.cartList.map((cart) => {
    if (cart.cid == cid) {
      let exists = false;
      cart.products = cart.products.map((product) => {
        if (product.pid == pid) {
          // Product already on cart
          exists = true;
          product.quantity++;
          return product;
        }
        return product;
      });

      if (!exists) cart.products.push({ pid: Number(pid), quantity: 1 }); // Product not on cart, add

      return cart;
    }
    return cart;
  });
  updateCartsData(); // update file
};

CartManager.prototype.readAllProductsFromCart = (cid = undefined) =>
  CartManager.cartList.find((cart) => cart.cid === cid)?.products;

CartManager.prototype.readProductByIDFromCart = (
  pid = undefined,
  cid = undefined
) =>
  CartManager.cartList
    .find((cart) => cart.cid === cid)
    ?.products.find((product) => product.pid === pid);

CartManager.prototype.deleteAllProductsFromCart = (cid = pid) => {
  CartManager.cartList = CartManager.cartList.map((cart) => {
    if (cart.cid === cid) {
      cart.products = [];
    }
    return cart;
  });

  updateCartsData();
};

CartManager.prototype.deleteProductByIDFromCart = (
  pid = undefined,
  cid = undefined
) => {
  CartManager.cartList = CartManager.cartList.map((cart) => {
    if (cart.cid === cid) {
      cart.products = [...cart.products.find((product) => product.pid !== pid)];
    }
    return cart;
  });

  updateCartsData();
};

module.exports = CartManager;
