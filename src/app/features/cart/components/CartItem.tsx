import { formatCurrency } from "@/app/lib/currency";
import { Minus, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "react-day-picker";

export const CartItem = ({ item, handlers }: any) => {
  const { handleUpdateQuantity, handleRemoveItem, handleSaveForLater } = handlers;

  return (
    <div className="flex justify-between p-4 border rounded-lg">
      <div>
        <h3>{item.product.name}</h3>
        <p>{formatCurrency(item.product.price)}</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() =>
              handleUpdateQuantity(item.product.id, item.quantity - 1, item.product.stock)
            }
          >
            <Minus />
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() =>
              handleUpdateQuantity(item.product.id, item.quantity + 1, item.product.stock)
            }
          >
            <Plus />
          </button>
        </div>
      </div>
      <div>
        <p>{formatCurrency(item.product.price * item.quantity)}</p>
        <Button onClick={() => handleSaveForLater(item.product.id)}>
          <Save />
        </Button>
        <Button onClick={() => handleRemoveItem(item.product.id, item.product.name)}>
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};
