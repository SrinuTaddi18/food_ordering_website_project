import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders/my-orders`);
      setOrders(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'pending': 'warning',
      'confirmed': 'info',
      'preparing': 'primary',
      'out for delivery': 'success',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    return <Badge bg={statusColors[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Container className="orders-container">
        <div className="text-center">
          <Spinner animation="border" variant="warning" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="orders-container">
      <h2 className="mb-4">My Orders</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {orders.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h4>No orders yet</h4>
          <p>Start ordering your favorite food!</p>
        </Alert>
      ) : (
        orders.map(order => (
          <Card key={order._id} className="order-card mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                <span className="ms-3 text-muted">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              {getStatusBadge(order.status)}
            </Card.Header>
            <Card.Body>
              <Table responsive variant="dark" className="mb-0">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.food?.image || 'https://via.placeholder.com/80x60?text=Food'}
                            alt={item.food?.name}
                            className="order-item-image"
                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/80x60?text=Food'; }}
                          />
                          <div className="ms-3">
                            <strong>{item.food?.name}</strong>
                          </div>
                        </div>
                      </td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price.toFixed(2)}</td>
                      <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="order-footer mt-3">
                <div className="order-info">
                  <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                  {order.phone && <p><strong>Phone:</strong> {order.phone}</p>}
                </div>
                <div className="order-total">
                  <strong>Total Amount: ₹{order.totalAmount.toFixed(2)}</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Orders;

