import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { Item } from '../types/item';

interface ItemFormProps {
  onItemChanged: (newItem: Item) => Promise<unknown> | void;
  itemId?: number;
  initialValues?: Partial<Item>;
  error?: string | null;
  submitting?: boolean;
}

export default function ItemForm({
    onItemChanged,
    itemId,
    initialValues,
    error = null,
    submitting = false,
  }: ItemFormProps) {
  const [name, setName] = useState<string>(initialValues?.name ?? '');
  const [price, setPrice] = useState<number>(initialValues?.price ?? 0);
  const [description, setDescription] = useState<string>(initialValues?.description ?? '');
  const [imageUrl, setImageUrl] = useState<string>(initialValues?.imageUrl ?? '');
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1); // This will navigate back one step in the history
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const item: Item = { itemId, name, price, description, imageUrl };
    await onItemChanged(item);
  };


   return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formItemName" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          pattern="[0-9a-zA-ZæøåÆØÅ. \-]{2,20}"
          title="The Name must be numbers or letters and between 2 to 20 characters."
        />
      </Form.Group>

      <Form.Group controlId="formItemPrice" className="mb-3">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter item price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          min="0.01"
          step="0.01"
        />
      </Form.Group>

      <Form.Group controlId="formItemDescription" className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter item description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formItemImageUrl" className="mb-3">
        <Form.Label>Image URL</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button variant="primary" type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : itemId ? 'Update Item' : 'Create Item'}
      </Button>
      <Button variant="secondary" onClick={onCancel} className="ms-2" disabled={submitting}>
        Cancel
      </Button>
    </Form>
  );
}

