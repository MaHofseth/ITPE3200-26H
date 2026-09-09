import { Item } from '../types/item';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
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
    headers: getAuthHeaders(), // Use the new helper here
    body: JSON.stringify(item),
  });
  return handleResponse<Item>(response);
}

export async function updateItem(item: Item): Promise<Item> {
  const response = await fetch(`${API_URL}/api/itemapi/update/${item.itemId}`, {
    method: 'PUT',
    headers: getAuthHeaders(), // Use the new helper here
    body: JSON.stringify(item),
  });
  return handleResponse<Item>(response);
}

export async function deleteItem(itemId: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/itemapi/delete/${itemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(), // Use the new helper here
  });
  if (!response.ok) {
    throw new Error(`Failed to delete item (status ${response.status})`);
  }
}