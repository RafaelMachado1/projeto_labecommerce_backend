import { TUser } from "./types"
import { TProduct } from "./types"
import { TPurchase } from "./types"

export const users: TUser[] = [
    {
        id: 'u01',
        email: 'rafael@gmail.com',
        password: '123456'
    },
    {
        id: 'u02',
        email: 'gabriel@gmail.com',
        password: '654321'
    }

]

export const products: TProduct[] = [
    {
        id: "p11",
        name: "Televisão",
        price: 120,
        category: "Eletro-domestico"
    },
    {
        id: "p12",
        name: "Cadeira",
        price: 480,
        category: "Móveis"
    }

]

export const purchases: TPurchase[] = [
    {
        userId: "pu01",
        productId: "p11",
        quantity: 1,
        totalPrice: 120
    },
    {
        userId: "pu02",
        productId: "p12",
        quantity: 1,
        totalPrice: 480
    }

]