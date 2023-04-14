export enum CATEGORIES { 
    CLOTHES_AND_SHOES = "Roupas e calçados",
    MOVEIS = "Movéis",
    ELETRONICOS =  "Eletrônicos"
}

export type TUser = {
    id: string,
    name: string,
    email: string,
    password: string
}

export type TProduct = {
    id: string,
    name: string,
    price: number,
    description: string,
    category: CATEGORIES,
    image_url: string
}

export type TPurchase = {
    id: string,
    buyer_id: string,
    total_price: number,
    paid: number
}
