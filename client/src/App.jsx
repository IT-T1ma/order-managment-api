import { useEffect, useState } from "react"
// API
import {
  deleteProduct,
  deleteUser,
  getOrdersByUser,
  getProducts,
  getUsers,
} from "./api/api"
// Components
import OrdersBlock from "./components/OrdersBlock"
import ProductsBlock from "./components/ProductsBlock"
import UsersBlock from "./components/UsersBlock"
// Styles
import styles from "./App.module.css"

export default function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res.data.data);
  };

  const fetchProducts = async () => {
    const res = await getProducts();
    setProducts(res.data.data);
  };

  const fetchOrders = async (userId) => {
    if (!userId) return;
    const res = await getOrdersByUser(userId);
    setOrders(res.data.data);
  };

  const handleUserSelect = async (id) => {
    setSelectedUserId(id);
    await fetchOrders(id);
  };

  const handleDataUpdate = async () => {
    await fetchUsers();
    await fetchProducts();
    if (selectedUserId) await fetchOrders(selectedUserId);
  };

  const handleUserDelete = async (id) => {
    await deleteUser(id);
    if (id === selectedUserId) setSelectedUserId(null);
    handleDataUpdate();
  };

  const handleProductDelete = async (id) => {
    await deleteProduct(id);
    handleDataUpdate();
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.topBlocks}>
        <UsersBlock
          users={users}
          onUserSelect={handleUserSelect}
          selectedUserId={selectedUserId}
          onUserDelete={handleUserDelete}
          onDataUpdate={handleDataUpdate}
        />
        <ProductsBlock
          products={products}
          onProductDelete={handleProductDelete}
          onDataUpdate={handleDataUpdate}
        />
      </div>
      <div className={styles.ordersBlock}>
        <OrdersBlock
          selectedUserId={selectedUserId}
          products={products}
          orders={orders}
          onDataUpdate={handleDataUpdate}
        />
      </div>
    </div>
  );
}
