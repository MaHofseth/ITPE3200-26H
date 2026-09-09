import { Card, Col, Row } from 'react-bootstrap';

const ItemGrid = ({ items, apiUrl }) => {

  return (
    <div>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {items.map(item => (
          <Col key={item.itemId}>
            <Card className="h-100">
              <Card.Img variant="top" src={`${apiUrl}${item.imageUrl}`} alt={item.name} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  {item.description}
                </Card.Text>
                <Card.Text>
                  Price: {item.price} NOK
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ItemGrid;
