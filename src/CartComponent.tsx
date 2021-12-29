import React, {useEffect, useState} from 'react';
import {CartItem} from "./CartItem";
import {Button, Col, Container, Row} from "react-bootstrap";
import {cartService} from "./CartService";
import {CartItemComponent} from "./CartItemComponent";
import {DataServiceInstance} from "./DataService";
import {ShopItem} from "./ShopItem";

/**
 * Состояние компоненты с корзиной.
 * Заполняется на основе ответа на запрос к серверу или из localstorage.
 * См {@link cartService}.
 */
interface CartComponentState {
    // Элементы в корзине
    cartItems: CartItem[];
    // Полная цена корины
    fullPrice: number;
}

/**
 * Компонента с корзиной.
 */
export function CartComponent() {
    // Состояние корзины и функция изменения
    let [state, changeState] = useState<CartComponentState>({
        // Начальное состояние, пока данные не загрузились: корзина пустая, цена 0
        cartItems: [],
        fullPrice: 0
    });

    // useEffect -- выполняется "один раз" на каждое изменение второго аргумента этой функции
    // здесь это [] то есть пустой массив. Получается, функция, которая загружает данные выполнится один раз
    useEffect(() => {
        // Вот эта функция и выполнится один раз

        // Получаем корзину
        cartService.getCart().then(async theCart => {
            // Для каждого элемента корзины загружаем "что" это за элемент (чтобы узнать цену)
            let allPromises = theCart.map(async (cartItem: CartItem) => {
                // Загружаем
                let shopItemPromise: Promise<ShopItem> = DataServiceInstance.getItem(cartItem.id);

                let shopItem = await shopItemPromise;

                // Умножаем цену на количество элементов
                return shopItem.price * cartItem.quantity;
            });

            // Ждём предыдущие запросы
            let prices: number[] = await Promise.all(allPromises);

            // Полная цена
            let fullPrice = null;

            if (prices.length) {
                // Если список с ценами вообще есть, то используем reduce:
                // функционал позволяет собрать все элементы массива в один, в данном случае просто сложение
                fullPrice = prices.reduce((previousValue, currentValue) => {
                    return previousValue + currentValue;
                })
            } else {
                // Пустая корзина -- цена 0
                fullPrice = 0;
            }

            changeState({
                cartItems: theCart,
                fullPrice: fullPrice
            });
        });
    }, []);

    return (
        <Container>
            {/*Полная цена*/}
            <h2>Всего: {state.fullPrice} руб.</h2>
            <Row>
                {/*Отрисовываем каждый элемент в корзине*/}
                {
                    state.cartItems.map((item) => {
                        return (
                            <Col xs={3}>
                                <CartItemComponent cartItem={item}/>
                            </Col>
                        );
                    })
                }
            </Row>
            {/*Просто кнопка-заглушка*/}
            <Button variant="success">Оплатить</Button>
        </Container>
    );
}
