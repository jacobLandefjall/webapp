/**
 * Importerarr klassen "LagerTitle" från filen "lager-title.js"
 * Definierar element lager-title och skickar klassen "LagerTitle"
 * Sedan "lagertitle" anropas när webbläsaren läser in elementet
 */
// Komponenter import
import LagerTitle from "./components/lager-title.js";
import ProductList from "./components/product-list.js";
import singleProduct from "./components/single-product.js";
import PacklistView from "./views/packlist.js";

import singleOrder from "./components/single-order.js";

import DeliveriesView from "./views/deliveries.js";
import DeliveriesList from "./components/deliveries-list.js";
import NewDelivery from "./components/new-delivery.js";

import LoginForm from "./components/login-form.js";
import LoginView from "./views/login.js";
customElements.define('login-form', LoginForm);
customElements.define('login-view', LoginView);


import InvoicesView from "./views/invoices.js";
import NewInvoiceView from "./views/new-invoice.js";
import InvoicesTable from "./components/invoices-table.js";
import InvoiceForm from "./components/invoice-form.js";
customElements.define('invoice-form', InvoiceForm);
customElements.define('invoices-table', InvoicesTable);
customElements.define('invoices-view', InvoicesView);
customElements.define('new-invoice', NewInvoiceView);






import Router from "./router.js";
import Navigation from "./navigation.js";
import ProductsView from "./views/products.js";

import ChatFormView from "./views/chat-form.js";
customElements.define('chat-form', ChatFormView);



customElements.define('lager-title', LagerTitle);
customElements.define('product-list', ProductList);
customElements.define('single-product', singleProduct);
customElements.define('deliveries-list', DeliveriesList);

customElements.define('router-outlet', Router);
customElements.define('navigation-outlet', Navigation);
customElements.define('products-view', ProductsView);
customElements.define('packlist-view', PacklistView);
customElements.define('single-order', singleOrder);
customElements.define('deliveries-view', DeliveriesView);
customElements.define('new-delivery', NewDelivery);



import OrdersView from "./views/orders.js";
customElements.define('orders-view', OrdersView);

import OrderList from "./components/order-list.js";
customElements.define('order-list', OrderList);

import WildcardList from "./components/wildcard-list.js";
customElements.define('wildcard-list', WildcardList);

import MapView from "./views/map.js";
customElements.define('map-view', MapView);

import CameraComponent from "./components/camera.js";
customElements.define('camera-component', CameraComponent);



