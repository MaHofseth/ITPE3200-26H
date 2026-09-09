import { Item } from '../types/item';

const API_URL = import.meta.env.VITE_API_URL;

const headers = {
  'Content-Type': 'application/json',
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed (status ${response.status})`);
  }
  return response.json();
}

export async function fetchItems(): Promise<Item[]> {
  const response = await fetch(`${API_URL}/api/itemapi/itemlist`);
  return handleResponse<Item[]>(response);
}

export async function fetchItemById(itemId: string): Promise<Item> {
  const response = await fetch(`${API_URL}/api/itemapi/${itemId}`);
  return handleResponse<Item>(response);
}

export async function createItem(item: Item): Promise<Item> {
  const response = await fetch(`${API_URL}/api/itemapi/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify(item),
  });
  return handleResponse<Item>(response);
}

export async function updateItem(item: Item): Promise<Item> {
  const response = await fetch(`${API_URL}/api/itemapi/update/${item.itemId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(item),
  });
  return handleResponse<Item>(response);
}

export async function deleteItem(itemId: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/itemapi/delete/${itemId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete item (status ${response.status})`);
  }
}