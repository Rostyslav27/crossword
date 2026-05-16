/**
 * In-App Purchase service stub.
 *
 * In production replace with react-native-iap:
 *   npm install react-native-iap
 *
 * Product IDs must be created in App Store Connect / Google Play Console:
 *   energy_50  → 50 energy for $0.99
 *   energy_200 → 200 energy for $2.49
 *
 * This stub immediately resolves purchases so the app can be tested
 * without a real store connection.
 */
import { IAP_PRODUCTS } from './energy';

export type IAPProduct = {
  productId: string;
  title: string;
  description: string;
  price: string;
  energyAmount: number;
};

export const IAP_PRODUCT_LIST: IAPProduct[] = [
  {
    productId: IAP_PRODUCTS.energy50,
    title: '50 Енергії',
    description: 'Миттєво отримайте 50 одиниць енергії',
    price: '$0.99',
    energyAmount: 50,
  },
  {
    productId: IAP_PRODUCTS.energy200,
    title: '200 Енергії',
    description: 'Найвигідніший пакет – 200 одиниць енергії',
    price: '$2.49',
    energyAmount: 200,
  },
];

/**
 * Attempt to purchase a product by productId.
 * Returns the energy amount awarded on success, or null on failure/cancel.
 */
export async function purchaseProduct(productId: string): Promise<number | null> {
  // TODO: replace with real react-native-iap call:
  //
  // import { requestPurchase, finishTransaction } from 'react-native-iap';
  // try {
  //   const purchase = await requestPurchase({ sku: productId });
  //   await finishTransaction({ purchase, isConsumable: true });
  //   return IAP_PRODUCT_LIST.find(p => p.productId === productId)?.energyAmount ?? null;
  // } catch {
  //   return null;
  // }

  console.log(`[IAP] Purchasing product (stub): ${productId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = IAP_PRODUCT_LIST.find((p) => p.productId === productId);
      console.log(`[IAP] Purchase complete (stub): +${product?.energyAmount ?? 0} energy`);
      resolve(product?.energyAmount ?? null);
    }, 800);
  });
}
