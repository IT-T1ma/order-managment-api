import { useState } from "react"
// API
import { createOrder, deleteOrder } from "../../api/api"
// Styles
import styles from './style.module.css'
import mainStyles from '../../App.module.css'

export default function OrdersBlock({ orders, products, selectedUserId, onDataUpdate }) {
  const [form, setForm] = useState({ productId: "", quantity: "" });
  const [error, setError] = useState("");

  const getProductInfo = (id) => {
    const p = products.find((prod) => prod._id === id);
    return p ? p.name : "Unknown";
  };

  const handleCreate = async () => {
    if (!selectedUserId || !form.productId || !form.quantity) {
      setError("Please fill all fields.");
      return;
    }
    try {
      await createOrder({
        userId: selectedUserId,
        productId: form.productId,
        quantity: Number(form.quantity),
      });
      setForm({ productId: "", quantity: "" });
      setError("");
      onDataUpdate();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create order");
    }
  };

  const handleDelete = async (id) => {
    await deleteOrder(id);
    onDataUpdate();
  };

  return (
    <div>
      <h2>Orders</h2>
      {!selectedUserId ? (
        <p>Please select a user</p>
      ) : (
        <>
          {orders.length === 0 ? (
            <p>No orders for this user</p>
          ) : (
						<table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{getProductInfo(order.productId)}</td>
                  <td>{order.quantity}</td>
                  <td>
                    <button className={mainStyles.deleteButton} onClick={() => handleDelete(order._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
          <h3>Create Order</h3>
          <select
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <button className={mainStyles.button} onClick={handleCreate}>Create Order</button>
          {error && <div className={mainStyles.error}>{error}</div>}
        </>
      )}
    </div>
  );
}
