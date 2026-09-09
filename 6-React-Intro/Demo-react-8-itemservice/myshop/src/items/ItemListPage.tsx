import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form } from 'react-bootstrap';
import ItemTable from './ItemTable';
import ItemGrid from './ItemGrid';
import { Item } from '../types/item';
import { Link } from 'react-router-dom';
import * as ItemService from './ItemService';

const API_URL = import.meta.env.VITE_API_URL;

export default function ItemListPage () {
  const [showTable, setShowTable] = useState<boolean>(() => {
  const savedViewMode = localStorage.getItem('itemViewMode');
  return savedViewMode !== 'grid'; // defaults to table view if nothing saved
});

  useEffect(() => {
  localStorage.setItem('itemViewMode', showTable ? 'table' : 'grid');
}, [showTable]);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleTableOrGrid = () => setShowTable(prev => !prev);

  const { data: items = [], isLoading, error, refetch } = useQuery<Item[], Error>({
    queryKey: ['items'],
    queryFn: ItemService.fetchItems,
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: ItemService.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const handleItemDeleted = (itemId: number) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the item ${itemId}?`);
    if (confirmDelete) {
      deleteMutation.mutate(itemId);
    }
  };

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
        ? <ItemTable items={filteredItems} apiUrl={API_URL} onItemDeleted={handleItemDeleted} />
        : <ItemGrid items={filteredItems} apiUrl={API_URL} onItemDeleted={handleItemDeleted} />}
      <Link to="/itemcreate" className="btn btn-secondary mt-3">Add New Item</Link> {/* this is a button */}
    </div>
  );
};
