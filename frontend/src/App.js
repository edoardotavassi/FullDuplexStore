import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderSummaryScreen from "./screens/OrderSummaryScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";

function App() {
  return (
    <Router>
      <Header></Header>
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} exact />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/spedizione" element={<ShippingScreen />} />
            <Route path="/ordine" element={<OrderScreen />} />
            <Route path="/ordine/:id" element={<OrderSummaryScreen />} />
            <Route path="/pagamento" element={<PaymentScreen />} />
            <Route path="/prodotti/:id" element={<ProductScreen />} />
            <Route path="/carrello/" element={<CartScreen />}>
              <Route path=":id" element={<CartScreen />} />
            </Route>
            <Route path="/admin/listautenti" element={<UserListScreen />} />
            <Route path="/admin/utente/:id/edit" element={<UserEditScreen />} />
            <Route
              path="/admin/listaprodotti"
              element={<ProductListScreen />}
            />
            <Route
              path="/admin/prodotti/:id/edit"
              element={<ProductEditScreen />}
            />
            <Route path="/admin/listaordini" element={<OrderListScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer></Footer>
    </Router>
  );
}

export default App;
