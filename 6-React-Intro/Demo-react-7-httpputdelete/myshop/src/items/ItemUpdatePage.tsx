import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ItemForm from './ItemForm';
import { Item } from '../types/item';
const API_URL = import.meta.env.VITE_API_URL;

async function fetchItem(itemId: string): Promise<Item> {
  const response = await fetch(`${API_URL}/api/itemapi/${itemId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch item');
  }
  return response.json();
}

async function updateItem(item: Item): Promise<Item> {
  const response = await fetch(`${API_URL}/api/itemapi/update/${item.itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error(`Failed to update item (status ${response.status})`);
  }
  return response.json();
}

export default function ItemUpdatePage() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const itemQuery = useQuery({
    queryKey: ['items', itemId],
    queryFn: () => fetchItem(itemId!),
    enabled: !!itemId,
  });

  const mutation = useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      navigate('/items');
    },
  });

  if (itemQuery.isLoading) return <p>Loading...</p>;
  if (itemQuery.isError) return <p>Failed to load item</p>;
  if (!itemQuery.data) return <p>No item found</p>;

  return (
    <div>
      <h2>Update Item</h2>
      <ItemForm
        onItemChanged={(item) => mutation.mutateAsync(item)}
        itemId={itemQuery.data.itemId}
        initialValues={itemQuery.data}
        error={mutation.error instanceof Error ? mutation.error.message : null}
        submitting={mutation.isPending}
      />
    </div>
  );
}