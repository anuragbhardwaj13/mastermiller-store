import { CartItem } from '@/types';

export const generateWhatsAppMessage = (cartItems: CartItem[]): string => {
  let message = "Hi Master Miller, I'd like to order:\n\n";
  let total = 0;

  cartItems.forEach((item) => {
    const itemTotal = item.product.price * item.quantity;
    const name = item.product.nameHindi
      ? `${item.product.name} (${item.product.nameHindi})`
      : item.product.name;

    message += `• ${name} - ${item.quantity} ${item.product.unit} - ₹${itemTotal}\n`;
    total += itemTotal;
  });

  message += `\n*Total: ₹${total}*`;
  message += `\n\nPlease confirm the order and let me know the delivery details.`;

  return message;
};

export const redirectToWhatsApp = (cartItems: CartItem[]) => {
  const message = generateWhatsAppMessage(cartItems);
  const encoded = encodeURIComponent(message);
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919053140726';
  const url = `https://wa.me/${phoneNumber}?text=${encoded}`;

  window.open(url, '_blank');
};
