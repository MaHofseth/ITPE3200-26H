import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Form } from 'react-bootstrap';
import ItemTable from './ItemTable';
import ItemGrid from './ItemGrid';

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
  const [showTable, setShowTable] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTableOrGrid = () => setShowTable(prev => !prev);

  const { data: items = [], isLoading, error, refetch } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="text-start">
      <h1>Items</h1>
      <Button onClick={() => refetch()} variant="primary" className="mb-3 me-2" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Refresh Items'}
      </Button>
      <Button onClick={toggleTableOrGrid} variant="primary" className="mb-3 me-2">
        {showTable ? `Display Grid` : 'Display Table'}
      </Button>
      <Form.Group className="mb-3">        
      <Form.Control
        type="text"
        placeholder="Search by name or description"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />  
      </Form.Group>  
      {error && <p style={{ color: 'red' }}>Failed to fetch items.</p>}
      {showTable 
      ? <ItemTable items={filteredItems} apiUrl={API_URL} />
      : <ItemGrid items={filteredItems} apiUrl={API_URL} />}
    </div>
  );
};

export default ItemListPage;