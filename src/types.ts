export enum CATEGORIES { //EXERCÍCIO 1
    CLOTHES_AND_SHOES = "Roupas e calçados",
    MOVEIS = "Movéis",
    ELETRONICOS =  "Eletrônicos"
}

export type TUser = {
    id: string,
    email: string,
    password: string
}

export type TProduct = {
    id: string,
    name: string,
    price: number,
    category: CATEGORIES
}

export type TPurchase = {
    userId: string,
    productId: string,
    quantity: number,
    totalPrice: number
}
