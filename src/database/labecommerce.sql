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
        category TEXT NOT NULL
    );

INSERT INTO
    products (id, name, price, description, category)
    VALUES  
        ('p001','tablet', 2120, 'Com processador Snapdragon 888', 'eletrônicos'), 
        ('p002', 'cadeira', 280,'Articulada para praia', 'móveis'), 
        ('p003', 'celular', 1900, 'Com processador Snapdragon 888 ', 'eletrônicos'), 
        ('p004', 'camisa', 120, '100% Algodão', 'Roupas e calçados'), 
        ('p005', 'mesa', 2500, 'Redonda de madeira de lei', 'móveis'),
        ('p006', 'sapato', 150, 'Em couro legítimo', 'Roupas e calçados');

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




-- EXERCÍCIO 2 APROFUNDAMENTO SQL
-- Get Products by id
SELECT * FROM products WHERE id = 'p001';

-- Delete User by i
DELETE FROM users WHERE id = '04';

-- Delete Product by id
DELETE FROM products WHERE id = 'p07';

-- Edit User by id
UPDATE users SET email = 'fulaninho@email.com' WHERE id = 'u03';

-- Edit Product by id
UPDATE products SET price = 1500.0 WHERE id = 'p005';


-- EXERCÍCIO 3 APROFUNDAMENTO SQL
-- Get All Users REFATORADO (retorna o resultado ordenado pela coluna email em ordem crescente)
SELECT * FROM users ORDER BY email ASC;

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


-- Purchases ----------------------------------------------------------

-- Criação da tabela de pedidos
CREATE TABLE purchases(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    total_price REAL UNIQUE NOT NULL,
    paid INTEGER NOT NULL,
    delivered_at TEXT,
    buyer_id TEXT NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES users(id) --buyer_id (TEXT, obrigatório e FK = referencia a coluna id da tabela users)
);


INSERT INTO purchases(id, total_price, paid, buyer_id)
VALUES
    ('b001', 2120, 0, 'u01'),
    ('b002', 280, 0, 'u01'),
    ('b003', 1900, 0, 'u02'),
    ('b004', 120, 0,'u02');

  SELECT * FROM purchases;  

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

