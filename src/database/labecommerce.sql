-- Active: 1680647533083@@127.0.0.1@3306

--Users-----------------------------------------
CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL
    );

INSERT INTO users (id, name, email, password)
VALUES 
    ('u01', 'Rafael', 'rafael@email.com','123456'),
    ('u02', 'Lana', 'lana@email.com', '123456'),
    ('u03', 'Gabriel', 'gabriel@email.com', '123456');

--Get All Users
SELECT * FROM users;

-- Create User
INSERT INTO users(id, name, email, password)
VALUES ('u04','Daniel', 'daniel@email.com', '123456');

-- Delete User by id
DELETE from users WHERE id = 'u04';

-- Edit User by id
UPDATE users SET email = 'rafaelmachado@gmail.com' WHERE id = 'u01';

-- Get All Users REFATORADO (retorna o resultado ordenado pela coluna email em ordem crescente)
SELECT * FROM users ORDER BY email ASC;


-- Products ----------------------------------------------------------------------
CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        image_url TEXT NOT NULL
    );
DROP TABLE products;

INSERT INTO
    products (id, name, price, description, category, image_url)
    VALUES  
        ('p001','tablet', 2120, 'Com processador Snapdragon 888', 'eletrônicos', 'https://th.bing.com/th/id/OIP.1W1x7YUlXu-YmxypdNeuVAHaE8?pid=ImgDet&rs=1'), 
        ('p002', 'cadeira', 280,'Articulada para praia', 'móveis', ' https://th.bing.com/th/id/OIP.v7xT9Bm_DPBKc6KlKi_MpgHaHa?pid=ImgDet&rs=1'), 
        ('p003', 'celular', 1900, 'Com processador Snapdragon 888 ', 'eletrônicos', 'https://th.bing.com/th/id/R.f72986038232a9f0728787b2f499c3f5?rik=5%2bjbfLKSBoQ4Lg&pid=ImgRaw&r=0'), 
        ('p004', 'camisa', 120, '100% Algodão', 'Roupas e calçados','https://decathlonpro.vtexassets.com/arquivos/ids/9132191-588-752/bl-ski-500-1-2-zip-top-m-dark-grey-xs-azul-pp1.jpg?v=637829632787530000'), 
        ('p005', 'mesa', 2500, 'Redonda de madeira de lei', 'móveis', 'https://th.bing.com/th/id/OIP.D5-5RjVlDliRCSjtoQxVJwHaFN?pid=ImgDet&rs=1'),
        ('p006', 'sapato', 150, 'Em couro legítimo', 'Roupas e calçados', 'https://th.bing.com/th/id/OIP.fzPtFwJQrtG4MxG5GjBsRAHaHQ?pid=ImgDet&rs=1');

-- Get All Products
SELECT * FROM products;

-- Get All Products versão 1 REFATORADO
-- (retorna o resultado ordenado pela coluna price em ordem crescente)
-- (limite o resultado em 20 iniciando pelo primeiro item)
SELECT * FROM products ORDER BY price ASC LIMIT 20 OFFSET 0;

-- Get All Products versão 2 REFATORADO
-- (mocke um intervalo de preços, por exemplo entre 100.00 e 300.00)
-- (retorna os produtos com preços dentro do intervalo mockado em ordem crescente)
SELECT * FROM products
WHERE price >= 100 AND price <= 500
ORDER BY price ASC;

-- Search Product by name
SELECT * FROM products WHERE name = "tablet";

-- Create Product
INSERT INTO products (id, name, price, description,  category)
VALUES ('p007', 'notebook', 4459.99, 'notebook gamer', 'eletrônicos');

-- Get Products by id
SELECT * FROM products WHERE id = 'p001';

-- Delete Product by id
DELETE FROM products WHERE id = 'p007';

-- Edit Product by id
UPDATE products SET price = 1990 WHERE id = 'p001';

-- Purchases ----------------------------------------------------------
CREATE TABLE purchases(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    total_price REAL UNIQUE NOT NULL,
    paid INTEGER NOT NULL,
    delivered_at TEXT,
    buyer_id TEXT NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES users(id) --buyer_id (TEXT, obrigatório e FK = referencia a coluna id da tabela users)
);

DROP TABLE purchases;

INSERT INTO purchases(id, buyer_id, total_price, paid)
VALUES
    ('b001', 'u01', 259.80, 0),
    ('b002', 'u01', 899, 0),
    ('b003', 'u02', 400, 0),
    ('b004', 'u02', 3489, 0)
;

  SELECT * FROM purchases;  

SELECT * FROM purchases
WHERE buyer_id = 'u01';

UPDATE purchases 
SET delivered_at = DATETIME ('NOW')
WHERE buyer_id = 'u01';

UPDATE purchases 
SET delivered_at = DATETIME ('NOW')
WHERE buyer_id = 'u02';


SELECT * FROM purchases
INNER JOIN users
ON purchases.buyer_id = users.id
WHERE buyer_id = 'u01';


-- purchase_products ----------------------------------------------

CREATE TABLE purchases_products(
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO purchases_products(purchase_id, product_id, quantity)
VALUES
    ('b001','p001', 2),
    ('b002','p003', 1),
    ('b003','p002', 1);

SELECT * FROM purchases_products;


SELECT
    purchases.id AS Id_da_compra,
    products.id AS Id_do_produto,
    products.name AS Nome_do_produto,
    products.category AS Categoria_do_produto,
    purchases_products.quantity AS quantidade,
    products.price AS Preço_do_produto,
    purchases.total_price AS Total_da_compra
FROM purchases_products
INNER JOIN purchases
ON purchases_products.purchase_id = purchases.id
INNER JOIN products
ON purchases_products.product_id = products.id;

