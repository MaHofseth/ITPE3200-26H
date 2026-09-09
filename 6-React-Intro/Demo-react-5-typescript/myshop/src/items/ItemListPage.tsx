import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Form } from 'react-bootstrap';
import ItemTable from './ItemTable';
import ItemGrid from './ItemGrid';
import { Item } from '../types/item';

const API_URL = import.meta.env.VITE_API_URL;

const fetchItems = async (): Promise<Item[]> => {
  const response = await fetch(`${API_URL}/api/itemapi/itemlist`);
  if (!response.ok) {
    console.error(`Fetch failed with status: ${response.status}`);
    throw new Error('Network response was not ok');
  }
  const data: Item[] = await response.json();
  console.log('Fetched items successfully:', data); // remove for production
  return data;
};

export default function ItemListPage () {
  const [showTable, setShowTable] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleTableOrGrid = () => setShowTable(prev => !prev);

  const { data: items = [], isLoading, error, refetch } = useQuery<Item[], Error>({
    queryKey: ['items'],
    queryFn: fetchItems,
  });

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
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
