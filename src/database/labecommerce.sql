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

SELECT * FROM products;

