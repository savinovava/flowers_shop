import React, {useEffect, useState} from 'react';
import {ItemColor, ShopItem} from "./ShopItem";
import {Col, Container, Form, Row} from "react-bootstrap";
import {ListItemComponent} from "./ListItemComponent";
import {DataServiceInstance} from "./DataService";
import "./MainComponent.scss";

/**
 * Состояние компоненты главная страница
 */
interface MainComponentState {
    items: ShopItem[];
    color: string | null;
}

/**
 * Главная страница
 */
export function MainComponent() {
    let [state, changeState] = useState<MainComponentState>({
        items: [],
        color: null
    });

    useEffect(() => {
        // Один раз загружаем все товары
        DataServiceInstance.getData(state.color).then(value => {
            changeState({
                items: value,
                color: state.color
            });
        });
    }, [state.color]);

    function onColorInputChange(event: React.ChangeEvent<HTMLSelectElement>) {
        let value: string = event.target.value;

        changeState({
            ...state,
            color: value
        });
    }

    let items = state.items;

    return (
      <Container>
          <Row>
              <Col xs={3}>
                  <Form.Select defaultValue={""} className="color-select" onChange={event => onColorInputChange(event)}>
                      {
                          Object.keys(ItemColor).map(color => {
                            // @ts-ignore
                            let humanReadable = ItemColor[color]

                            return (
                                <option key={color} value={color}>
                                    {humanReadable}
                                </option>
                            );
                          })
                      }
                      <option value="">Все</option>
                  </Form.Select>
              </Col>
          </Row>
          <Row>
              {
                  items.map((item: ShopItem) => {
                      return (
                          <Col xs={3} key={item.id}>
                              <ListItemComponent item={item}/>
                          </Col>
                      )
                  })
              }
          </Row>
      </Container>
    );
}
