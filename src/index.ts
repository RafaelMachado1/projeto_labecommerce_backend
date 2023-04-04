import { users } from "./database";
import { products } from "./database";
import { purchases } from "./database";

import {
    createUser,
    getAllUsers,
    createProduct,
    getAllProducts,
    getProductById,
    queryProductsByName,
    createPurchase,
    getAllPurchasesFromUserId
  } from "./database";
  import { CATEGORIES } from "./types";
  
  console.table([users, products, purchases])

  createUser("03", "daniel@email.com", "123456")
  console.table(getAllUsers())
  
  createProduct("201", "Celular", 900, CATEGORIES.ELETRONICOS)
  console.table(getAllProducts())
  
  console.log(getProductById("001"))
  
  queryProductsByName('Celular')
  
  createPurchase("03", "201", 1, 110)
  
  console.table(getAllPurchasesFromUserId("03"))