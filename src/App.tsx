import React from 'react';
import './App.css';
import {MainComponent} from "./MainComponent";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {SingleItemComponent} from "./SingleItemComponent";
import {CartComponent} from "./CartComponent";
import {Button, Container, Nav, Navbar} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {faOpencart} from "@fortawesome/free-brands-svg-icons";

/**
 * Главная компонента приложения.
 */
export function App() {

    return (
        // В корне приложения -- роутер, который "отрисовывает" нужную компоненту в зависимости от URL
        <BrowserRouter>
            {/*Часть, которая рисуется всегда -- хедер страницы*/}
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/">Магазин цветов</Navbar.Brand>
                    <Nav className="me-auto">
                        {/*Ссылка перехода на главную страницу*/}
                        <Nav.Link href="/">Главная</Nav.Link>
                    </Nav>
                    <Nav className="justify-content-end">
                        {/*Ссылка для перехода в корзину*/}
                        <Link to={"/cart"}>
                            {/*Кнопка корзины*/}
                            <Button variant={"primary"}>
                                {/*Иконка с корзиной*/}
                                <FontAwesomeIcon icon={faOpencart} />
                            </Button>
                        </Link>
                    </Nav>
                </Container>
            </Navbar>

            <Routes>
                {/*Три пути:*/}
                {/*1. / - главная страница*/}
                {/*2. /item/:itemId - конкретный элемент из "ассортимента"*/}
                {/*3. /cart - корзина*/}
                <Route path={""} element={<MainComponent/>}/>
                <Route path={"item/:itemId"} element={<SingleItemComponent/>}/>
                <Route path={"cart"} element={<CartComponent/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
