import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Modal, Badge, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
//import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Admin = () => {
 // const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [foodForm, setFoodForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'General',
    available: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [foodsRes, ordersRes] = await Promise.all([
        axios.get(`${API_URL}/admin/foods`),
        axios.get(`${API_URL}/admin/orders`)
      ]);
      setFoods(foodsRes.data);
      setOrders(ordersRes.data);
      setError('');
    } catch (error) {
      setError('Failed to load data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (editingFood) {
        await axios.put(`${API_URL}/admin/foods/${editingFood._id}`, foodForm);
      } else {
        await axios.post(`${API_URL}/admin/foods`, foodForm);
      }
      setShowFoodModal(false);
      setEditingFood(null);
      setFoodForm({
        name: '',
        description: '',
        price: '',
        image: '',
        category: 'General',
        available: true
      });
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save food item');
    }
  };

  const handleEditFood = (food) => {
    setEditingFood(food);
    setFoodForm({
      name: food.name,
      description: food.description,
      price: food.price,
      image: food.image,
      category: food.category,
      available: food.available
    });
    setShowFoodModal(true);
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await axios.delete(`${API_URL}/admin/foods/${id}`);
        fetchData();
      } catch (error) {
        setError('Failed to delete food item');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${API_URL}/admin/orders/${orderId}`, { status });
      fetchData();
    } catch (error) {
      setError('Failed to update order status');
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
      <Container className="admin-container">
        <div className="text-center">
          <Spinner animation="border" variant="warning" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="admin-container">
      <h2 className="mb-4">Admin Panel</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs defaultActiveKey="orders" id="admin-tabs" className="mb-4">
        <Tab eventKey="orders" title="Orders">
          <Card className="admin-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>All Orders</h5>
            </Card.Header>
            <Card.Body>
              {orders.length === 0 ? (
                <Alert variant="info">No orders yet</Alert>
              ) : (
                <Table responsive variant="dark">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-6).toUpperCase()}</td>
                        <td>
                          {order.user?.name}<br />
                          <small className="text-muted">{order.user?.email}</small>
                        </td>
                        <td>
                          {order.items.length} item(s)
                        </td>
                        <td>₹{order.totalAmount.toFixed(2)}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Form.Select
                            size="sm"
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="out for delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </Form.Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="foods" title="Food Items">
          <Card className="admin-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>Food Items Management</h5>
              <Button variant="warning" onClick={() => {
                setEditingFood(null);
                setFoodForm({
                  name: '',
                  description: '',
                  price: '',
                  image: '',
                  category: 'General',
                  available: true
                });
                setShowFoodModal(true);
              }}>
                Add New Food Item
              </Button>
            </Card.Header>
            <Card.Body>
              {foods.length === 0 ? (
                <Alert variant="info">No food items. Add your first item!</Alert>
              ) : (
                <Table responsive variant="dark">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Available</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods.map(food => (
                      <tr key={food._id}>
                        <td>
                          <img
                            src={food.image || 'https://via.placeholder.com/80x60?text=Food'}
                            alt={food.name}
                            className="admin-food-image"
                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/80x60?text=Food'; }}
                          />
                        </td>
                        <td>{food.name}</td>
                        <td className="description-cell">{food.description}</td>
                        <td>₹{food.price.toFixed(2)}</td>
                        <td>{food.category}</td>
                        <td>
                          <Badge bg={food.available ? 'success' : 'danger'}>
                            {food.available ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditFood(food)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteFood(food._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      <Modal show={showFoodModal} onHide={() => {
        setShowFoodModal(false);
        setEditingFood(null);
      }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingFood ? 'Edit Food Item' : 'Add New Food Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFoodSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={foodForm.name}
                onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={foodForm.description}
                onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={foodForm.price}
                onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                value={foodForm.image}
                onChange={(e) => setFoodForm({ ...foodForm, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={foodForm.category}
                onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Available"
                checked={foodForm.available}
                onChange={(e) => setFoodForm({ ...foodForm, available: e.target.checked })}
              />
            </Form.Group>
            <Button variant="warning" type="submit" className="w-100">
              {editingFood ? 'Update' : 'Add'} Food Item
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Admin;

