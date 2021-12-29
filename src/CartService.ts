import {CartItem} from "./CartItem";
import {DATA_URL} from "./DataService";

// Сервис для работы с корзиной
interface CartService {
    // Получить все элементы корзины
    getCart(): Promise<CartItem[]>;

    // Добавить в корзину новый товар
    addCartItem(newCartItem: CartItem): Promise<void>;
}

// Реализация сервиса корзины с JSON-server
class ServerCartService implements CartService {

    async getCart(): Promise<CartItem[]> {
        // Делаем запрос к JSON-server, получаем все элементы в корзине
        let responsePromise: Promise<Response> = fetch(`${DATA_URL}/cart`);
        let response: Response = await responsePromise;

        // Получаем JSON из запроса и он преобразуется в объект
        let jsonPromise: Promise<any> = response.json();

        // Мы знаем, что это массив (список) CartItem
        let data = await jsonPromise as CartItem[];

        return data;
    }

    async addCartItem(newCartItem: CartItem): Promise<void> {
        // Достаём корзину с сервера
        let currentCart = await this.getCart();

        // Достаём элемент корзины с таким же ID что и пытаемся добавить в корзину
        let existingItem = currentCart.find(value => value.id === newCartItem.id);

        // Если там такой элемент есть (то мы будем его менять)
        let hasItem: boolean = existingItem != null;

        // То нам надо указать этот ID в URL-адресе, для изменения данных
        // Это то как обычно работает REST-протокол и JSON-server
        let url: string = hasItem ? `${DATA_URL}/cart/${newCartItem.id}` : `${DATA_URL}/cart`;

        // Если объект такой уже есть и мы его меняем, то метод PUT, если создаём новый, то POST
        let method: string = hasItem ? 'PUT' : 'POST';

        if (existingItem != null) {
            newCartItem = existingItem;

            newCartItem.quantity++;
        }

        await fetch(url, {
            method: method,
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify(newCartItem)
        });

        return;
    }

}

class BrowserCartService implements CartService {

    static CART_KEY = "cart";

    getCart(): Promise<CartItem[]> {
        // из local storage достаём строку по JSON'у
        let cart: string | null = localStorage.getItem(BrowserCartService.CART_KEY);

        // если есть строка
        if (cart != null) {
            let value = JSON.parse(cart) as CartItem[];
            // Парсим строчку в объект (массив CartItem)
            return Promise.resolve(value);
        }

        return Promise.resolve([]);
    }

    async addCartItem(newCartItem: CartItem): Promise<void> {
        // Получим корзину
        let cart: CartItem[] = await this.getCart();

        // Найдём в ней элемент по id того, который хотим добавить
        let existingItem = cart.find(value => value.id === newCartItem.id);

        if (existingItem != null) {
            // Если он есть, то просто увеличиваем количество на один
            existingItem.quantity++;
        } else {
            // Если его нет, то добавляем
            cart.push(newCartItem);
        }

        // Превращаем список в JSON строку
        let jsonCart = JSON.stringify(cart);

        // Записываем в local storage
        localStorage.setItem(BrowserCartService.CART_KEY, jsonCart);

        return Promise.resolve();
    }

}

// Используем серверную корзину
export const cartService = new ServerCartService();

