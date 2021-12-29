import {ShopItem} from "./ShopItem";
import {CommentItem} from "./CommentItem";


export const DATA_URL = "http://localhost:4000";

export class DataService {

    async getData(color: string | null): Promise<ShopItem[]> {
        let url = "";

        if (color) {
            url = `${DATA_URL}/items?color=${color}`;
        } else {
            url = `${DATA_URL}/items`;
        }

        let responsePromise: Promise<Response> = fetch(url);
        let response: Response = await responsePromise;

        let jsonPromise: Promise<any> = response.json();

        let data = await jsonPromise as ShopItem[];

        return data;
    }

    async getItem(id: number): Promise<ShopItem> {
        let responsePromise: Promise<Response> = fetch(`${DATA_URL}/items/${id}`);

        return await (await responsePromise).json() as ShopItem;
    }

    async submitComment(shopItemId: number, textContent: string) {
        let comment: CommentItem = {
            shopItemId: shopItemId, text: textContent
        };

        await fetch(`${DATA_URL}/comments/`, {
            method: "POST",
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify(comment)
        })
    }

    async getAllComments(shopItemId: number): Promise<CommentItem[]> {
        let url = `${DATA_URL}/comments?shopItemId=${shopItemId}`;

        return (await (await fetch(url)).json());
    }

}

export const DataServiceInstance = new DataService();
