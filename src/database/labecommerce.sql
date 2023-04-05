-- Active: 1680647533083@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );

SELECT * FROM users;

INSERT INTO
    users (id, email, password)
VALUES (
        'u01',
        'rafael@email.com',
        "123456"
    ), (
        'u02',
        'lana@email.com',
        "123456"
    ), (
        'u03',
        'gabriel@email.com',
        "123456"
    );

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL
    );

INSERT INTO
    products (id, name, price, category)
    VALUES  
        ('p001','tablet', 2120, 'eletrônicos'), 
        ('p002', 'cadeira', 280, 'móveis'), 
        ('p003', 'celular', 1900, 'eletrônicos'), 
        ('p004', 'camisa', 120, 'Roupas e calçados'), 
        ('p005', 'mesa', 2500, 'móveis'),
        ('p006', 'sapato', 150, 'Roupas e calçados');

-- EXERCÍCIO 1  APROFUNDAMENTO SQL
-- Get All Users
SELECT * FROM users;

-- Get All Products
SELECT * FROM products;

-- Search Product by name
SELECT * FROM products WHERE name = "tablet";

-- Create User
INSERT INTO
    users(id, email, password)
VALUES (
        '04',
        'daniel@email.com',
        'U852147'
    );

-- Create Product
INSERT INTO
    products(id, name, price, category)
VALUES (
        'p07',
        'notebook',
        4459.99,
        'eletrônicos'
    );



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




-- EXERCÍCIO 1 RELAÕES SQL I
-- Criação da tabela de pedidos
CREATE TABLE purchases(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    total_price REAL UNIQUE NOT NULL,
    paid INTEGER NOT NULL,
    delivered_at TEXT,
    buyer_id TEXT NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES users(id) --buyer_id (TEXT, obrigatório e FK = referencia a coluna id da tabela users)
);


-- EXERCÍCIO 2 RELAÕES SQL I
-- Popule sua tabela de pedidos, criada no exercício anterior.
-- Por enquanto não se preocupe em adicionar produtos ao pedido, veremos isso na aula que vem.
-- Com isso em mente, crie um valor aleatório para o preço total do pedido.
INSERT INTO purchases(id, total_price, paid, delivered_at, buyer_id)
VALUES
    ('b001', 240, 0, NULL,'01'),
    ('b002', 899, 0, NULL,'01'),
    ('b003', 400, 0, NULL,'02'),
    ('b004', 3489, 0, NULL,'02');

  SELECT * FROM purchases;  
-- a) Crie dois pedidos para cada usuário cadastrado
-- No mínimo 4 no total (ou seja, pelo menos 2 usuários diferentes) e devem iniciar com a data de entrega nula.
-- b) Edite o status da data de entrega de um pedido
-- Simule que o pedido foi entregue no exato momento da sua edição (ou seja, data atual).
  UPDATE purchases 
SET delivered_at = DATETIME ('NOW')
WHERE buyer_id = '01';

UPDATE purchases 
SET delivered_at = DATETIME ('NOW')
WHERE buyer_id = '02';


-- EXERCÍCIO 3 RELAÇÕES SQL
-- Crie a query de consulta utilizando junção para simular um endpoint de histórico de compras de um determinado usuário.
-- Mocke um valor para a id do comprador, ela deve ser uma das que foram utilizadas no exercício 2.
SELECT * FROM purchases
INNER JOIN users
ON purchases.buyer_id = users.id
WHERE buyer_id = '01'
