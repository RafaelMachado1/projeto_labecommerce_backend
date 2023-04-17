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



-- Products ----------------------------------------------------------------------
CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
    );
DROP TABLE products;

INSERT INTO
    products (id, name, price, description, image_url)
    VALUES  
        ('p001','tablet', 2120, 'Com processador Snapdragon 888', 'https://th.bing.com/th/id/OIP.1W1x7YUlXu-YmxypdNeuVAHaE8?pid=ImgDet&rs=1'), 
        ('p002', 'cadeira', 280,'Articulada para praia', ' https://th.bing.com/th/id/OIP.v7xT9Bm_DPBKc6KlKi_MpgHaHa?pid=ImgDet&rs=1'), 
        ('p003', 'celular', 1900, 'Com processador Snapdragon 888 ', 'https://th.bing.com/th/id/R.f72986038232a9f0728787b2f499c3f5?rik=5%2bjbfLKSBoQ4Lg&pid=ImgRaw&r=0'), 
        ('p004', 'camisa', 120, '100% Algodão','https://decathlonpro.vtexassets.com/arquivos/ids/9132191-588-752/bl-ski-500-1-2-zip-top-m-dark-grey-xs-azul-pp1.jpg?v=637829632787530000'), 
        ('p005', 'mesa', 2500, 'Redonda de madeira de lei', 'https://th.bing.com/th/id/OIP.D5-5RjVlDliRCSjtoQxVJwHaFN?pid=ImgDet&rs=1'),
        ('p006', 'sapato', 150, 'Em couro legítimo', 'https://th.bing.com/th/id/OIP.fzPtFwJQrtG4MxG5GjBsRAHaHQ?pid=ImgDet&rs=1');

-- Get All Products
SELECT * FROM products;


-- Purchases ----------------------------------------------------------
CREATE TABLE purchases(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer_id TEXT NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    paid INTEGER DEFAULT (0) NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES users(id)
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


-- purchase_products ----------------------------------------------

CREATE TABLE purchases_products(
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

DROP TABLE purchases_products;


INSERT INTO purchases_products(purchase_id, product_id, quantity)
VALUES
    ('b001','p001', 2),
    ('b002','p003', 1),
    ('b003','p002', 1);

SELECT * FROM purchases_products;




