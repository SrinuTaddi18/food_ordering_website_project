import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      setError('Please enter delivery address');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderData = {
        items: cartItems.map(item => ({
          foodId: item.foodId,
          quantity: item.quantity
        })),
        deliveryAddress,
        phone
      };

      await axios.post(`${API_URL}/orders`, orderData);
      clearCart();
      setShowModal(false);
      navigate('/orders');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="cart-container">
        <Alert variant="info" className="text-center">
          <h4>Your cart is empty</h4>
          <Button variant="warning" onClick={() => navigate('/')}>
            Browse Food Items
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="cart-container">
      <h2 className="mb-4">Shopping Cart</h2>

      <Row>
        <Col md={8}>
          <Card className="cart-items-card">
            <Card.Body>
              <Table responsive hover variant="dark">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.foodId}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.food.image}
                            alt={item.food.name}
                            className="cart-item-image"
                          />
                          <div className="ms-3">
                            <strong>{item.food.name}</strong>
                          </div>
                        </div>
                      </td>
                      <td>₹{item.food.price.toFixed(2)}</td>
                      <td>
                        <div className="quantity-controls">
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="quantity-value">{item.quantity}</span>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td>₹{(item.food.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeFromCart(item.foodId)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="cart-summary-card">
            <Card.Header>
              <h5>Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee:</span>
                <span>₹2.00</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{(getTotalPrice() + 2).toFixed(2)}</span>
              </div>
              <Button
                variant="warning"
                size="lg"
                className="w-100 mt-3"
                onClick={() => setShowModal(true)}
              >
                Proceed to Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Delivery Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Form.Group>
            <div className="order-total">
              <strong>Total: ₹{(getTotalPrice() + 2).toFixed(2)}</strong>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cart;

