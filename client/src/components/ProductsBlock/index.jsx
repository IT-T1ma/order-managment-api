import { useState } from "react"
// API
import { createProduct, deleteProduct } from "../../api/api"
// Styles
import styles from './style.module.css'
import mainStyles from '../../App.module.css'

export default function ProductsBlock({ products, onDataUpdate }) {
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [error, setError] = useState("");

  const handleCreate = async () => {
    const { name, price, stock } = form;
    if (!name || price === "" || stock === "") {
      return setError("Please fill in all fields.");
    }
    try {
      await createProduct({
        name,
        price: Number(price),
        stock: parseInt(stock, 10),
      });
      setForm({ name: "", price: "", stock: "" });
      setError("");
      onDataUpdate();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id} className={styles.productItem}>
            {product.name} — ${product.price}, Stock: {product.stock}
            <button 
							className={mainStyles.deleteButton}
							onClick={() => deleteProduct(product._id).then(onDataUpdate)}>
							Delete
						</button>
          </li>
        ))}
      </ul>

      <h3>Create Product</h3>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />
      <input
        type="number"
        placeholder="Stock"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: e.target.value })}
      />
      <button onClick={handleCreate} className={mainStyles.button}>Create</button>
      {error && <div className={mainStyles.error}>{error}</div>}
    </div>
  );
}
