import {defineStore} from "pinia";
import {ref, computed, reactive} from "vue";
import {ProductType} from "../interfaces/types";


interface ProductTypeInStore extends ProductType {
    quantity: number;
    color: string;
    size: string;
}

export const usePiniaStore = defineStore('furnitureStore', () => {


    let cartList = reactive<ProductTypeInStore[]>([])

    const addToCart = (product: ProductType, color: string, size: string) => {
        const item =
            cartList.find(f => f.id === product.id && f.color === color && f.size === size);

        if (item) {
            console.log('item already exist!')
            item.quantity += 1;

            console.log(item)
        } else {
            cartList.push({...product, quantity: 1, color, size})
        }
    }

    const removeItem = (productId: number) => {

    }


    return {cartList, addToCart};
});
