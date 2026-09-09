import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ItemForm from './ItemForm';
import { Item } from '../types/item';

const API_URL = import.meta.env.VITE_API_URL;

async function createItem(newItem: Item): Promise<Item> {
  const response = await fetch(`${API_URL}/api/itemapi/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem),
  });
  if (!response.ok) {
    throw new Error(`Failed to create item (status ${response.status})`);
  }
  return response.json();
}

export default function ItemCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // gets the SAME instance from App.tsx, not a new one

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      navigate('/items'); // go to the ItemListPage
    },
  });

  return (
    <ItemForm
      onItemChanged={(item) => mutation.mutateAsync(item)}
      error={mutation.error instanceof Error ? mutation.error.message : null}
      submitting={mutation.isPending}
    />
  );
}