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

-- EXERCÍCIO 1
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



-- EXERCÍCIO 2
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


-- EXERCÍCIO 3
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