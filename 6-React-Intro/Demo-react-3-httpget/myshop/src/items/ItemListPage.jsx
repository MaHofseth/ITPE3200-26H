import { useQuery } from '@tanstack/react-query';
import { Table, Button } from 'react-bootstrap';

const API_URL = 'http://localhost:5234'

const fetchItems = async () => {
  const response = await fetch(`${API_URL}/api/itemapi/itemlist`);
  if (!response.ok) {
    console.error(`Fetch failed with status: ${response.status}`);
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  console.log('Fetched items successfully:', data); // remove for production
  return data;
};

const ItemListPage = () => {
  const { data: items = [], isLoading, error, refetch } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });

  return (
    <div className="text-start">
      <h1>Items</h1>
      <Button onClick={() => refetch()} className="btn btn-primary mb-3" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Refresh Items'}
      </Button>
      {error && <p style={{ color: 'red' }}>Failed to fetch items.</p>}
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Descriptions</th>
          <th>Images</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.itemId}>
            <td>{item.itemId}</td>
            <td>{item.name}</td>
            <td>{item.price} NOK</td>
            <td>{item.description}</td>
            <td><img src={`${API_URL}${item.imageUrl}`} alt={item.name} width="120" /></td>
          </tr>
        ))}
      </tbody>
      </Table>
    </div>
  );
};

export default ItemListPage;