import {ShopItem} from "./ShopItem";

/**
 * Интерфейс, для объекта в корзине
 */
export interface CartItem {
    // Идентификатор товара
    id: number;
    // Количество этого товара в корзине
    quantity: number;
}

/**
 * Функция-помощник, преобразует товар магазина в объект для корзины с количеством 1.
 * @param shopItem Товар из ассортимента магазина.
 */
export function cartItemFromShopItem(shopItem: ShopItem) : CartItem {
    return {
        id: shopItem.id, quantity: 1
    };
}
