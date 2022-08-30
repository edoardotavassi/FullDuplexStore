import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButton } from "react-paypal-button-v2";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

function OrderSummaryScreen() {
  const params = useParams();
  const orderId = params.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  //calcolato solo se arriva l'ordine
  if (!loading && !error) {
    order.itemsPrice = order.order_items
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  }
  //client ID AZw2usckJvDOjWFRRD6uvOgysuWkChHHAaEuE9Zgpq62v39pXLOkx0nglrPvSMPkERkBlZMu0PLUfwj8

  const addPaypalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AZw2usckJvDOjWFRRD6uvOgysuWkChHHAaEuE9Zgpq62v39pXLOkx0nglrPvSMPkERkBlZMu0PLUfwj8&currency=USD";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }

    if (
      !order ||
      successPay ||
      order.id !== Number(orderId) ||
      successDeliver
    ) {
      dispatch({ type: ORDER_PAY_RESET });

      dispatch({ type: ORDER_DELIVER_RESET });

      dispatch(getOrderDetails(orderId));
    } else if (!order.is_paid) {
      if (!window.paypal) {
        addPaypalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [
    dispatch,
    order,
    orderId,
    successPay,
    successDeliver,
    navigate,
    userInfo,
  ]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <h1>Ordine: {order.id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Spedizione</h2>
              <p>
                <strong>Nome: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Spedizione: </strong>
                {order.shipping_address.address}, {order.shipping_address.city},
                {"  "}
                {order.shipping_address.postalCode},{"  "}
                {order.shipping_address.country}
              </p>
              {order.is_delivered ? (
                <Message variant="success">
                  {" "}
                  Consegnato il {order.delivered_at}
                </Message>
              ) : (
                <Message variant="warning"> Non consegnato</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Metodo di Pagamento</h2>

              <p>
                <strong>Metodo: </strong>
                {order.payment_method}
              </p>
              {order.is_paid ? (
                <Message variant="success"> Pagato il {order.paid_at}</Message>
              ) : (
                <Message variant="warning"> Non pagato</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Prodotti</h2>
              {order.order_items.length === 0 ? (
                <Message variant="info">L'ordine è vuoto</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.order_items.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/prodotti/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.quantity} X €{item.price} = €
                          {(item.quantity * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Ordine</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Prodotti:</Col>
                  <Col>€{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Spedizione:</Col>
                  <Col>€{order.shipping_price}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>IVA:</Col>
                  <Col>€{order.tax_price}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Totale:</Col>
                  <Col>€{order.total_price}</Col>
                </Row>
              </ListGroup.Item>

              {!order.is_paid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.total_price}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
            {loadingDeliver && <Loader />}

            {userInfo &&
              userInfo.is_admin &&
              order.is_paid &&
              !order.is_delivered && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={deliverHandler}
                  >
                    Segna come Consegnato
                  </Button>
                </ListGroup.Item>
              )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderSummaryScreen;
