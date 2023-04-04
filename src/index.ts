//EXERCÍCIO 1

import { users, products, purchases } from "./database";
import { TUser, TProduct, TPurchase } from "./types";

  
//além de importar o express, também precisamos importar os objetos Request
//e Response, sempre entre chaves {}
import express, {Request, Response} from 'express';

//import do CORS
import cors from 'cors';

//criação do servidor express
const app = express();

//configuração do middleware que garante que nossas respostas estejam sempre
//no formato json
app.use(express.json());

//configuração do middleware que habilita o CORS
app.use(cors());


//colocando nosso servidor para escutar a porta 3003 da nossa máquina (primeiro 
//parâmetro da função listen)
//a função de callback (segundo parâmetro da função listen) serve para sabermos 
//que o servidor está de pé, através do console.log que imprimirá a mensagem no 
//terminal
app.listen(3003, ()=>{
    console.log("Servidor rodando na porta 3003")
})


//Utilizamos o app, escolhemos o método get, indicamos o path ‘/ping’ 
//e declaramos a função handler (que recebe nossos parâmetros req e res, 
//respectivamente tipados como Request e Response)
app.get('/ping', (req: Request, res: Response)=>{
    res.send('Pong!')
})


//EXERCÍCIO 2

//Endpoint usado para buscar dados, nesse caso busca de usuário
app.get('/users', (req:Request, res: Response)=>{
  res.status(200).send(users)
})

//Endpoint usado para buscar dados, nesse caso busca de produtos
app.get('/products',(req:Request, res: Response)=>{
  res.status(200).send(products)
})

//Endpoint que Possibilita a busca por parte de um recurso através de consultas.
app.get("/product/search", (req:Request, res: Response)=>{
  const q = req.query.q as string

  const result = products.filter((product)=>{
      return product.name.toLowerCase().includes(q.toLowerCase())
  })

  res.status(200).send(result)
})



// EXERCÍCIO 3
//Endpoint usado para criar um novo recurso, nesse caso um novo usário
app.post("/users", (req:Request, res: Response)=>{
  const {id, email, password} = req.body as TUser

  const newUser = {
      id,
      email,
      password
  }

  users.push(newUser)
  res.status(201).send("Cadastro realizado com sucesso")
})


//Endpoint usado para criar um novo recurso, nesse caso um novo produto
app.post("/products", (req:Request, res: Response)=>{
  const {id, name, price, category} = req.body as TProduct

  const newProduct = {
      id: id,
      name: name,
      price: price,
      category: category
  }

  products.push(newProduct)
  res.status(201).send("Produto criado com sucesso")
})


//Endpoint usado para criar um novo recurso, nesse caso uma nova compra
app.post("/purchases", (req:Request, res: Response)=>{
  const {userId, productId, quantity, totalPrice} = req.body as TPurchase
  const newPurchase: TPurchase = {
      userId: userId,
      productId: productId,
      quantity: quantity,
      totalPrice: totalPrice
  }

  purchases.push(newPurchase)
  res.status(201).send("Compra realizada com sucesso")
})