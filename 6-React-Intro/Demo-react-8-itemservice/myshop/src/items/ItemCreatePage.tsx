import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ItemForm from './ItemForm';
import { Item } from '../types/item';
import * as ItemService from './ItemService';

export default function ItemCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // gets the SAME instance from App.tsx, not a new one

  const mutation = useMutation({
    mutationFn: ItemService.createItem,
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