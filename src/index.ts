//EXERCÍCIO 1
import { users, products, purchases } from "./database";
import { TUser, TProduct, TPurchase } from "./types";
import { CATEGORIES } from "./types";
 
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


//Get All Users -> (obter todos os usuários)
//Este endpoint serve para acessar os dados gerais de todos os usuários cadastrados. 
// Nos dados estão incluidos: id, email e password.
app.get('/users', (req: Request, res: Response) => {
    try {
        res.status(200).send(users)
    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

//Get All Products -> (obter todos os produtos)
//Este endpoint serve para acessar os dados gerais de todos os produtos cadastrados. 
// Nos dados estão incluidos: id, name, price, category.
app.get('/products', (req: Request, res: Response) => {
    try {
        res.status(200).send(products)
    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})


//Get All Products Search Product by name -> (obter todos os produtos de pesquisa de produtos por nome)
//Este endpoint serve para acessar os dados gerais do produto cadastrado pelo nome do produto.
// Nos dados estão incluidos: id, name, price, category.
app.get("/products/search", (req: Request, res: Response) => {
    try {
        const q = req.query.q as string
        if (q !== undefined) {
            if (q.length < 1) {
                res.status(400)
                throw new Error("O nome do produto deve ser possuir no mínimo 1 caractere.");
            }
        }

        const result = products.filter((item) => {
            return item.name.toLowerCase().includes(q.toLowerCase())
        })

        res.status(200).send(result)

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})


//Post Create User -> (Publicar, criar usuário)
// Este endpoint serve para criar um usuário novo.
// precisa ser passado os dados: id, email, password. 
app.post("/users", (req: Request, res: Response) => {
    try {
        const { id, email, password } = req.body

        if (typeof id !== 'string') {
            res.status(400)
            throw new Error("'id' deve ser uma string");
        }

        if (typeof email !== 'string') {
            res.status(400)
            throw new Error("'email' deve ser uma string");
        }

        if (typeof password !== 'string') {
            res.status(400)
            throw new Error("'password' deve ser uma string");
        }

        const newUser = {
            id,
            email,
            password
        }

        const resultId = users.find((user) => user.id === id)
        const resultEmail = users.find((user) => user.email === email)

        if (resultId) {
            res.status(400)
            throw new Error("'id' já existente no cadastro")
        }
        if (resultEmail) {
            res.status(400)
            throw new Error("'email' já existente no cadastro")
        }

        users.push(newUser)
        res.status(201).send("Cadastro realizado com sucesso")

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

//Post Create Product  -> (Publicar, criar produto)
// Este endpoint serve para criar um usuário produto.
// precisa ser passado os dados: id, name, price, category. 
app.post("/products", (req: Request, res: Response) => {
    try {
      const { id, name, price, category }: TProduct = req.body;
  
      if (!id) {
        res.status(400);
        throw new Error("'id' deve ser passado no body");
      }
  
      if (!name) {
        res.status(400);
        throw new Error("'name' deve ser passado no body");
      }
  
      if (!price) {
        res.status(400);
        throw new Error("'price' deve ser passado no body");
      }
  
      if (!category) {
        res.status(400);
        throw new Error("'category' deve ser passado no body");
      }
  
      if (id !== undefined) {
        if (typeof id !== "string") {
          res.status(400);
          throw new Error("'id' deve ser do tipo 'string'");
        }
      }
  
      if (name !== undefined) {
        if (typeof name !== "string") {
          res.status(400);
          throw new Error("'name' deve ser do tipo 'string'");
        }
      }
  
      if (price !== undefined) {
        if (typeof price !== "number") {
          res.status(400);
          throw new Error("'price' deve ser do tipo 'number'");
        }
      }
  
      if (category !== undefined) {
        if (
          category !== CATEGORIES.CLOTHES_AND_SHOES &&
          category !== CATEGORIES.MOVEIS &&
          category !== CATEGORIES.ELETRONICOS 
        ) {
          res.status(400);
          throw new Error(
            "'category' deve ter um tipo válido: 'Roupas e calçados', 'Móveis', 'Eletrônicos'"
          );
        }
      }
  
      const searchId = products.find((product) => product.id === id);
      if (searchId) {
        res.status(400);
        throw new Error("Já existe um produto cadastrado com esse 'id'");
      }
      const newProduct: TProduct = { id, name, price, category };
      products.push(newProduct);
      res.status(201).send("Produto cadastrado com sucesso!");
    } catch (error) {
      console.log(error);
      if (res.statusCode === 200) {
        res.status(500);
      }
      res.send(error.message);
    }
  });

//Create Purchase -> (criar compra)
// Este endpoint serve para criar uma nova compra.
// precisa ser passado no body os dados da compra: userId, productId, quantity, totalPrice.
 app.post("/purchases", (req: Request, res: Response) => {
    try {
        const { userId, productId, quantity, totalPrice } = req.body

        if (typeof userId !== "string") {
            res.status(400)
            throw new Error("'id' deve ser uma string")
        }
        if (typeof productId !== "string") {
            res.status(400)
            throw new Error("'productId' deve ser uma string")
        }
        if (typeof quantity !== "number") {
            res.status(400)
            throw new Error("'quantity' deve ser um número")
        }
        if (typeof totalPrice !== "number") {
            throw new Error("'totalPrice' deve ser um número")
        }

        const newPurchase = {
            userId: userId,
            productId: productId,
            quantity: quantity,
            totalPrice: totalPrice
        }

        const returnId = users.find((user) => user.id === userId)
        const returnProduct = products.find((product) => product.id === productId)
        const returnPrice = products.find((product) => {
            const totalPurchase = product.price * newPurchase.quantity
            if (totalPurchase === newPurchase.totalPrice) {
                return totalPurchase
            }
        })
        console.log(returnPrice)

        if (!returnId) {
            res.status(400)
            throw new Error("Usuário não cadastrado, 'id' não encontrada")
        }
        if (!returnProduct) {
            res.status(400)
            throw new Error("Produto não cadastrado")
        }
        if (!returnPrice) {
            res.status(400)
            throw new Error("Total da compra não está correto")
        }

        purchases.push(newPurchase)
        res.status(201).send("Compra realizada com sucesso")

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})


//Get Products by id  (obter produtos por ID)
// Este endpoint serve para burcar um produto pelo seu ID.
// Nos dados retornados estão incluidos: id, name, price, category.
app.get("/products/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const result = products.filter((product) => {
            return product.id === id
        })

        if (result.length <= 0) {
            res.status(400)
            throw new Error("O produto não existe")
        }
        res.status(200).send(result)

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})


//Get User Purchases by User id -> (Obter compras do usuário por ID do usuário)
// Este endpoint serve para obter as compras do usuário através do ID do usuário
// Nos dados retornados estão: ID do usuário, ID do produto, quantidade comprada e preço total.
app.get("/users/:id/purchases", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const idUser = users.find((user) => user.id === id)

        if (!idUser) {
            throw new Error("Usuário não cadastrado")
        }

        const result = purchases.filter((purchase) => {
            return purchase.userId.toLowerCase().includes(id.toLowerCase())
        })

        if (result.length <= 0) {
            res.status(400)
            throw new Error("Nenhuma compra cadastrada para este usuário")
        }
        res.status(200).send(result)

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})


//Delete User by id -> (excluir usuário por ID)
// Este endpoint serve para deletar o usuário através do seu Id
app.delete("/user/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const idUser = users.find((user) => user.id === id)

        if (!idUser) {
            throw new Error("Usuário não cadastrado")
        }

        const userIndex = users.findIndex((user) => {
            return user.id === id
        })

        if (userIndex >= 0) {
            users.splice(userIndex, 1)
            res.status(200).send("Usuário excluído com sucesso")
        }

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})



//Delete Product by id  -> (Excluir produto por ID)
// Este endpoint serve para deletar o produto através do seu Id
app.delete("/product/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const idProduct = products.find((product) => product.id === id)

        if (!idProduct) {
            throw new Error("Produto não cadastrado")
        }

        const productIndex = products.findIndex((product) => {
            return product.id === id
        })

        if (productIndex >= 0) {
            products.splice(productIndex, 1)
            res.status(200).send("Produto excluído com sucesso")
        }

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})


//Edit User by id  -> (Editar usuário por ID)
// Este endpoint serve para editar o usuário. A busca é feita através do ID
// os dados que podem ser alterados no body são: Id, email, password
app.put("/user/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const newId = req.body.id
        const newEmail = req.body.email
        const newPassword = req.body.password

        if (newId !== undefined) {
            if (typeof newId !== 'string') {
                res.status(400)
                throw new Error("'id' deve ser uma string");
            }
        }

        if (newEmail !== undefined) {
            if (typeof newEmail !== 'string') {
                res.status(400)
                throw new Error("'email' deve ser uma string");
            }
        }

        if (newPassword !== undefined) {
            if (typeof newPassword !== 'string') {
                res.status(400)
                throw new Error("'password' deve ser uma string");
            }
        }

        const userToEdit = users.find((user) => {
            return user.id === id
        })

        if (!userToEdit) {
            res.status(400)
            throw new Error("Usuário não cadastrado")
        }

        if (userToEdit) {
            userToEdit.id = newId || userToEdit.id
            userToEdit.email = newEmail || userToEdit.email
            userToEdit.password = newPassword || userToEdit.password
        }
        res.status(200).send("Atualização realizada com sucesso")

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})


//Edit Product by id -> (Editar produto por ID)
// Este endpoint serve para editar o produto. A busca é feita através do ID
// os dados que podem ser alterados no body são: Id, name, price, category
app.put("/product/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const newId = req.body.id 
        const newName = req.body.name 
        const newPrice = req.body.price 
        const newCategory = req.body.category 

        if (newId !== undefined) {
            if (typeof newId !== 'string') {
                res.status(400)
                throw new Error("'id' deve ser uma string");
            }
        }

        if (newName !== undefined) {
            if (typeof newName !== 'string') {
                res.status(400)
                throw new Error("'name' deve ser uma string");
            }
        }

        if (newPrice !== undefined) {
            if (typeof newPrice !== 'number') {
                res.status(400)
                throw new Error("'price' deve ser uma string");
            }
        }
        if(newCategory !== undefined){
            if (
                newCategory !== CATEGORIES.CLOTHES_AND_SHOES &&
                newCategory !== CATEGORIES.MOVEIS &&
                newCategory !== CATEGORIES.ELETRONICOS
            ) {
                res.status(400)
                throw new Error("'category' deve ser uma categoria válida: Roupas e sapatos, Móveis ou Eletronicos")
            }
        }
        
        const product = products.find((product) => {
            return product.id === id
        })

        if (!product) {
            res.status(400)
            throw new Error("Produto não cadastrado")
        }

        if (product) {
            product.id = newId || product.id
            product.name = newName || product.name
            product.price = isNaN(newPrice) ? product.price : newPrice
            product.category = newCategory || product.category
            
        } 
        res.status(200).send("Cadastro atualizado com sucesso")

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})

