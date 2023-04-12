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


//Get All Users -> (obter todos os usuários)  REFATORADO
//Este endpoint serve para acessar os dados gerais de todos os usuários cadastrados. 
// Nos dados estão incluidos: id,name, email, password e data/hora.
app.get("/users", async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`SELECT * FROM users;`)

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

//Get All Products -> (obter todos os produtos) REFATORADO
//Este endpoint serve para acessar os dados gerais de todos os produtos cadastrados. 
// Nos dados estão incluidos: id, name, price, description, category e image_url.
app.get('/products', async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`SELECT *FROM products;`)
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


//Get All Products Search Product by name -> (obter todos os produtos de pesquisa de produtos por nome)
//Este endpoint serve para acessar os dados gerais do produto cadastrado pelo nome do produto.
// Nos dados estão incluidos: id, name, price, category.
app.get("/product/search", async (req: Request, res: Response) => {
    try {
        const name = req.query.name as string

        const [result] = await db.raw(`
        SELECT * FROM products 
        WHERE name = "${name}";
    `)
        
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


//Post Create User -> (Publicar, criar usuário)
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

        const [user] = await db.raw(`
            SELECT * FROM users
			    WHERE id = "${id}"
                OR email = "${email}"
            ;
        `)

        if(user){
            res.status(400)
            throw new Error("'id' ou 'email' já existente no cadastro");
            
        } else{
            await db.raw(`
            INSERT INTO users(id, name, email, password)
            VALUES("${id}", "${name}", "${email}", "${password}");
        `)
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



//Post Create Product  -> (Publicar, criar produto)
// Este endpoint serve para criar um usuário produto.
// precisa ser passado os dados: id, name, price, category. 
//Create Product - REFATORADO
app.post("/products", async (req: Request, res: Response) => {
    try {
        const { id, name, price, description, category, image_url} = req.body

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

        const [product] = await db.raw(`
            SELECT * FROM products
			    WHERE id = "${id}"
            ;
        `)

        if (product) {
            res.status(400)
            throw new Error("'id' já existente no cadastro")
        } else {
            await db.raw(`
            INSERT INTO products (id, name, price, description, category, image_url)
            VALUES ("${id}", "${name}", "${price}", "${description}", "${category}", "${image_url}");`)
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

//Create Purchase -> (criar compra)
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
        
        const [userId] = await db.raw(`
            SELECT * FROM users
            WHERE id = ${buyer_id};
        `)

        if (userId) {
            await db.raw(`
            INSERT INTO purchases (id, buyer_id, total_price, paid)
            VALUES ("${id}","${buyer_id}","${total_price}","${paid}")
        ;`)
            
        } else {
            res.status(400)
            throw new Error("Usuário não cadastrado, 'id' não encontrada")
        }
        
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
//Get Products by id - REFATORADO
app.get("/products/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const [result] = await db.raw(`
        SELECT * FROM products
        WHERE id = "${id}"
        `)

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

//Get User Purchases by User id -> (Obter compras do usuário por ID do usuário)
// Este endpoint serve para obter as compras do usuário através do ID do usuário
// Nos dados retornados estão: ID do usuário, ID do produto, quantidade comprada e preço total.
//Get User Purchases by User id 
app.get("/users/:id/purchases", async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const [idUser] = await db.raw(`
        SELECT * FROM users
        WHERE id = "${id}"
        `)
        
        if (!idUser) {
            res.status(400)
            throw new Error("Usuário não cadastrado")
        }

        const [result] = await db.raw(`
            SELECT * FROM purchases
            WHERE buyer_id = ${id};
        `)

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



//Delete User by id -> (excluir usuário por ID)
// Este endpoint serve para deletar o usuário através do seu Id
//Delete User by id - ok
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

