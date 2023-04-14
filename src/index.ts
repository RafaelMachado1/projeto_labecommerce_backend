import { users, products, purchases } from "./database";
import { TUser, TProduct, TPurchase } from "./types";
import { CATEGORIES } from "./types";
 
import express, {Request, Response} from 'express';
import cors from 'cors';
import { db } from "./database/knex";

const app = express();
app.use(express.json());
app.use(cors());

app.listen(3003, ()=>{
    console.log("Servidor rodando na porta 3003")
})

app.get('/ping', (req: Request, res: Response)=>{
    res.send('Pong!')
})


//Get All Users -> (obter todos os usuários)  REFATORADO com a query builder
//Este endpoint serve para acessar os dados gerais de todos os usuários cadastrados. 
// Nos dados estão incluidos: id,name, email, password e data/hora.
app.get("/users", async (req: Request, res: Response) => {
    try {
        const result = await db("users") as string

        res.status(200).send(result)

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//Get All Products -> (obter todos os produtos) REFATORADO coma query builder
//Este endpoint serve para acessar os dados gerais de todos os produtos cadastrados. 
// Nos dados estão incluidos: id, name, price, description, category e image_url.
app.get('/products', async (req: Request, res: Response) => {
    try {
        const result = await db("products") as string

        res.status(200).send(result)
    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//Get All Products Search Product by name -> (obter todos os produtos de pesquisa de produtos por nome) REFATORADO coma query builder
//Este endpoint serve para acessar os dados gerais do produto cadastrado pelo nome do produto.
// Nos dados estão incluidos: id, name, price, category.
app.get("/products/search", async (req: Request, res: Response) => {
    try {
        const name = req.query.name as string
        console.log(name)
        const [result] = await db("products").where("name", "LIKE", `%${name}%`)
        
        if(!result){
        res.status(400)
        throw new Error("Produto inexistente");
        
        }

        if (name !== undefined) {
            if (name.length < 1) {
                res.status(400)
                throw new Error("O nome do produto deve ser possuir no mínimo 1 caractere.");
            }
        }

        res.status(200).send(result)

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//Post Create User -> (Publicar, criar usuário) REFATORADO coma query builder
// Este endpoint serve para criar um usuário novo.
// precisa ser passado os dados: id, email, password. 
app.post("/users", async (req: Request, res: Response) => {
    try {
        const { id, name, email, password } = req.body

        if (
            typeof id !== 'string' ||
            typeof id !== 'string' ||
            typeof id !== 'string' ||
            typeof id !== 'string') {
            res.status(400)
            throw new Error("O dado inserido deve ser uma string");
        }

        if(id.length < 1 || name.length < 1 || email.length < 1 || password.length <1){
            res.status(400)
            throw new Error("Dados inválidos, precisam ter no mínimo 1 caracter.");
        }

        const [user] = await db("users").where({id: id}).orWhere({email: email})

        if(user){
            res.status(400)
            throw new Error("'id' ou 'email' já existente no cadastro");
            
        } else{

            const newUser = {
                id,
                name,
                email,
                password
            }
            await db("users").insert(newUser)
        }

        res.status(201).send("Cadastro realizado com sucesso")

    } catch (error: any) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})



//Post Create Product  -> (Publicar, criar produto) REFATORADO com a query builder
// Este endpoint serve para criar um usuário produto.
// precisa ser passado os dados: id, name, price, category. 
//Create Product - REFATORADO
app.post("/products", async (req: Request, res: Response) => {
    try {
        const { id, name, price, description, category, image_url} = req.body as TProduct

        if (
            typeof id !== 'string' || 
            typeof name !== 'string' ||
            typeof description !== 'string' ||
            typeof category !== 'string'||
            typeof image_url !== 'string') {
            res.status(400)
            throw new Error("O dado inserido deve ser uma string");
        }

        if (typeof price !== 'number') {
            res.status(400)
            throw new Error("'price' deve ser um número");
        }
        if (
            category !== CATEGORIES.ELETRONICOS &&
            category !== CATEGORIES.CLOTHES_AND_SHOES &&
            category !== CATEGORIES.MOVEIS 
        ) {
            res.status(400)
            throw new Error("'category' deve ser uma categoria válida: Eletrônicos, Eletroportáteis, Eletrodomésticos, Móveis ou Ventilação")
        }

        if(
            id.length < 1 || 
            name.length < 1 || 
            description.length <1 || 
            category.length < 1||
            image_url.length < 1){
            res.status(400)
            throw new Error("Dados inválidos, precisam ter no mínimo 1 caracter.");
        }

        const [product] = await db("products").where({id: id})

        if (product) {
            res.status(400)
            throw new Error("'id' já existente no cadastro")
        } else {
            const newProduct = {
                id,
                name,
                price,
                description,
                category,
                image_url
            }
            await db("products").insert(newProduct)
        }

        res.status(201).send("Produto cadastrado com sucesso")

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})



//Create Purchase -> (criar compra) REFATORADO com a query builder
// Este endpoint serve para criar uma nova compra.
// precisa ser passado no body os dados da compra: userId, productId, quantity, totalPrice.
 //Create Purchase - INCOMPLETO, falta validação de erro se o id informado é cadastrado ou não.
app.post("/purchases", async (req: Request, res: Response) => {
    try {
        const { id, buyer_id, total_price, paid } = req.body

        if (
            typeof id !== "string" ||
            typeof buyer_id !== "string") {
            res.status(400)
            throw new Error("O dado inserido deve ser uma string")
        }

                
        if (typeof total_price !== "number" ||
            typeof paid !== "number") {
            res.status(400)
            throw new Error("O dado inserido deve ser um número")
        }

        const [userId] = await db("users").where({id: buyer_id})
        
        if (!userId) {
            res.status(400)
            throw new Error("Usuário não cadastrado, 'id' não encontrada")  
        } 
        
        const newPurchase ={
            id,
            buyer_id,
            total_price
        }
        await db("purchases").update(newPurchase).where({id})
        res.status(201).send({
            message: "Compra realizada com sucesso",
            purchase: newPurchase
        })
    

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})


//Get Products by id  (obter produtos por ID) REFATORADO coma query builder
// Este endpoint serve para burcar um produto pelo seu ID.
// Nos dados retornados estão incluidos: id, name, price, category.
//Get Products by id - REFATORADO
app.get("/products/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const [result] = await db("products").where({id: id})

        if (!result) {
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

//Get User Purchases by User id -> (Obter compras do usuário por ID do usuário) REFATORADO coma query builder
// Este endpoint serve para obter as compras do usuário através do ID do usuário
// Nos dados retornados estão: ID do usuário, ID do produto, quantidade comprada e preço total.
//Get User Purchases by User id 
app.get("/users/:id/purchases", async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const [idUser] = await db("users").where({id: id})
        
        if (!idUser) {
            res.status(400)
            throw new Error("Usuário não cadastrado")
        }

        const [result] = await db("purchases").select(
            "*"  
          ).innerJoin(
              "users",
              "purchases.buyer_id",
              "=",
              "users.id"
          ).where({"users.id": id})

        if (!result) {
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



//Delete User by id -> (excluir usuário por ID) REFATORADO com a query builder
// Este endpoint serve para deletar o usuário através do seu Id
//Delete User by id - ok
app.delete("/user/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const [idUser] = await db("users").where({id: id})

        if (!idUser) {
            res.status(404)
            throw new Error("Usuário não cadastrado")
        }

        await db("users").del().where({id: id})

        res.status(200).send("Usuário excluído com sucesso")
        
    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})



//Delete Product by id  -> (Excluir produto por ID) REFATORADO com a query builder
// Este endpoint serve para deletar o produto através do seu Id
app.delete("/product/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const [idProduct] = await db("products").where({id: id})

        if (!idProduct) {
            throw new Error("Produto não cadastrado")
        }

        await db("products").del().where({id: id})

        res.status(200).send("Produto excluído com sucesso")
        
    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})


//Edit User by id  -> (Editar usuário por ID) REFATORADO com a query builder
// Este endpoint serve para editar o usuário. A busca é feita através do ID
// os dados que podem ser alterados no body são: Id, email, password
app.put("/user/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const newId = req.body.id as string | undefined
        const newName = req.body.name as string | undefined
        const newEmail = req.body.email as string | undefined
        const newPassword = req.body.password as string | undefined

        if (newId !== undefined) {
            if (typeof newId !== 'string') {
                res.status(400)
                throw new Error("'id' deve ser uma string");
            }
        }

        if (newName !== undefined) {
            if (typeof newName !== 'string') {
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

        const [userToEdit] = await db("users").where({id: id})

        if (!userToEdit) {
            res.status(404)
            throw new Error("Usuário não cadastrado")
        } else {
            const updateUser = {
                id: newId || userToEdit.id,
                name: newName || userToEdit.name,
                email: newEmail || userToEdit.email,
                password: newPassword || userToEdit.password
            }
            await db("users").update(updateUser).where({id: id})
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


//Edit Product by id -> (Editar produto por ID) REFATORADO com a query builder
// Este endpoint serve para editar o produto. A busca é feita através do ID
// os dados que podem ser alterados no body são: Id, name, price, category
app.put("/product/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const newId = req.body.id as string | undefined
        const newName = req.body.name as string | undefined
        const newPrice = req.body.price as number | undefined
        const newDescription = req.body.description as string | undefined
        const newCategory = req.body.category as CATEGORIES | undefined
        const newImage = req.body.image_url as string | undefined

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

        if (newDescription !== undefined) {
            if (typeof newDescription !== 'string') {
                res.status(400)
                throw new Error("'description' deve ser uma string");
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
        
        const [product] = await db("products").where({id:id})

        if (!product) {
            res.status(404)
            throw new Error("Produto não cadastrado")
        } else {
            const updateProduct: TProduct = {
                id: newId || product.id,
                name: newName || product.name,
                price: isNaN(newPrice) ? product.price : newPrice,
                description: newDescription || product.description,
                category: newCategory || product.category,
                image_url: newImage || product.image_url
            }
            await db("products").update(updateProduct).where({id:id})
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


//Get Purchase by id
app.get("/purchases/:id", async (req: Request, res: Response)=>{
    try {
        const id = req.params.id
        const [idPurchase] = await db("purchases").where({id: id})

        if(!idPurchase){
            res.status(400)
            throw new Error("Compra não localizada")
        } 
        
        const [purchase] = await db("purchases").select(
            "purchases.id AS compra_Id",
            "purchases.total_price AS totalPrice",
            "purchases.created_at AS dataHoraCompra",
            "purchases.paid AS taPago",
            "users.id AS idComprador",
            "users.email AS email",
            "users.name AS name"
        ).innerJoin(
            "users",
            "purchases.buyer_id",
            "=",
            "users.id"
        ).where({"purchases.id": id})

        const purchaseTotal = await db("purchases_products").select(
            "products.id",
            "products.name",
            "products.price",
            "products.description",
            "products.image_url",
            "purchases_products.quantity"
        ).innerJoin(
            "products",
            "purchases_products.product_id",
            "=",
            "products.id"
        ).where({purchase_id: id})


        const result = {...purchase, isPaid: purchase.isPaid === 0? false: true, productList: purchaseTotal}
        
        res.status(200).send(result)
        
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})