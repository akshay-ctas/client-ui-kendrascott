import { openDB } from "idb";
import { CartItem } from "@/lib/cartTypes";

const DB_NAME = "kendrascott";
const STORE_NAME = "cart";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function getCartFromDB(): Promise<CartItem[]> {
  const db = await getDB();
  const cart = await db.get(STORE_NAME, "items");
  return cart || [];
}

export async function saveCartToDB(cart: CartItem[]) {
  const db = await getDB();
  await db.put(STORE_NAME, cart, "items");
}
