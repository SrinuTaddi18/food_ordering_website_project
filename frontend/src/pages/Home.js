import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './Home.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const placeholderImg = 'https://via.placeholder.com/400x300?text=Food+Item';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/food`);
      setFoods(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load food items');
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/food`, {
        params: { search: searchTerm }
      });
      setFoods(response.data);
    } catch (error) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="home-container">
      <div className="home-header">
        <h1 className="text-center mb-4">Welcome to Food Delivery</h1>
        <Form onSubmit={handleSearch} className="mb-4">
          <InputGroup size="lg">
            <Form.Control
              type="text"
              placeholder="Search for food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="warning" type="submit">
              Search
            </Button>
            <Button variant="secondary" onClick={fetchFoods}>
              Clear
            </Button>
          </InputGroup>
        </Form>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="warning" />
        </div>
      ) : (
        <Row>
          {filteredFoods.length === 0 ? (
            <Col>
              <Alert variant="info" className="text-center">
                No food items found. Try a different search term.
              </Alert>
            </Col>
          ) : (
            filteredFoods.map(food => (
              <Col key={food._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="food-card">
                  <Card.Img
                    variant="top"
                    src={food.image || placeholderImg}
                    alt={food.name}
                    onError={(e) => { e.currentTarget.src = placeholderImg; }}
                  />
                  <Card.Body>
                    <Card.Title>{food.name}</Card.Title>
                    <Card.Text className="food-description">{food.description}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="food-price">₹{food.price.toFixed(2)}</span>
                      <Button
                        variant="warning"
                        onClick={() => addToCart(food)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
};

export default Home;

