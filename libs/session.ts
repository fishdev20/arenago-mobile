import { deleteItem, getItem, setItem } from './storage';

const KEY = 'clair.jwt';

export async function saveJWT(token: string) {
  await setItem(KEY, token);
}

export async function loadJWT() {
  return getItem(KEY);
}

export async function clearJWT() {
  await deleteItem(KEY);
}
