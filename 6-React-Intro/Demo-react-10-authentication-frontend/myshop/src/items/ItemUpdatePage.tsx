import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ItemForm from './ItemForm';
import { Item } from '../types/item';
import * as ItemService from './ItemService';

export default function ItemUpdatePage() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const itemQuery = useQuery({
    queryKey: ['items', itemId],
    queryFn: () => ItemService.fetchItemById(itemId!),
    enabled: !!itemId,
  });

  const mutation = useMutation({
    mutationFn: ItemService.updateItem,
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