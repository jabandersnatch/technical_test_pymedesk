/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */

'use client';

import React, { useEffect, useState } from 'react'; import {
  useFetchOrdersQuery,
  useCreateOrderMutation,
  useFetchCustomersQuery,
  useFetchProductsQuery,
} from '@/redux/api';
import {
  Customer, OrderGet, OrderPost, OrderItemPost, Product,
} from '@/types';
import { FiSearch, FiPlusCircle, FiMinusCircle } from 'react-icons/fi';
import { useRouter, usePathname } from 'next/navigation';

function OrdersPage() {
  const router = useRouter();
  const location = usePathname();
  const [orders, setOrders] = useState<OrderGet[]>([]);
  const [newOrder, setNewOrder] = useState<OrderPost>({
    customer_id: 0, products: [], status: '', delivery_rule: '', observations: '', paid: false,
  });
  const [filters, setFilters] = useState({
    customerName: '',
    status: '',
    deliveryRule: '',
  });
  const [newOrderItemsPost, setNewOrderItemsPost] = useState<OrderItemPost[]>([{ product_id: 0, quantity: 0 }]);
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const { data, error, isLoading } = useFetchOrdersQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: customers, error: customersError, isLoading: customersLoading } = useFetchCustomersQuery();
  const { data: products, error: productsError, isLoading: productsLoading } = useFetchProductsQuery();

  useEffect(() => {
    if (data) {
      const ordersData = data.results as OrderGet[];
      setOrders(ordersData);
    }
    return () => {
      setOrders([]);
    };
  }, [data, location]);

  if (isLoading || customersLoading || productsLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }
  if (error || customersError || productsError) {
    return <div className="flex justify-center items-center h-screen"><p>Error</p></div>;
  }

  const goToDetail = (id: number) => {
    router.push(`/pedidos/${id}`);
  };

  const handleAddOrderItem = () => {
    setNewOrderItemsPost([...newOrderItemsPost, { product_id: 0, quantity: 0 }]);
  };

  const handleOrderItemChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>, index: number, field: 'product_id' | 'quantity') => {
    const newOrderItems = [...newOrderItemsPost];
    if (field === 'product_id') {
      newOrderItems[index].product_id = parseInt(e.target.value, 10);
    } else {
      newOrderItems[index].quantity = parseInt(e.target.value, 10);
    }
    console.log(newOrderItems);
    setNewOrderItemsPost(newOrderItems);
  };

  const handleRemoveOrderItem = (index: number) => {
    const newOrderItems = [...newOrderItemsPost];
    newOrderItems.splice(index, 1);
    setNewOrderItemsPost(newOrderItems);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newOrderItems = newOrderItemsPost.filter((orderItem) => orderItem.product_id !== 0);

    const updatedNewOrder = { ...newOrder, products: newOrderItems };
    setNewOrder(updatedNewOrder);

    if (updatedNewOrder) {
      try {
        const response = await createOrder(updatedNewOrder).unwrap();
        if (response.id) {
          const savedOrder = response as OrderGet;
          setOrders([...orders, savedOrder]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    const { customerName, status, deliveryRule } = filters;
    return (
      order.customer.name.toLowerCase().includes(customerName.toLowerCase())
    && order.status.toLowerCase().includes(status.toLowerCase())
    && order.delivery_rule.toLowerCase().includes(deliveryRule.toLowerCase())
    );
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="flex flex-col items-center justify-center h-5/6 bg-white dark:bg-black w-full sm:w-screen gap-4">
      <div className="flex flex-col w-full">
        <div className="flex flex-col w-full bg-white dark:bg-black p-4">
          <h1 className="text-xl sm:text-3xl mb-6 text-center font-bold">Crear Pedido</h1>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center w-full bg-white dark:bg-black p-4">
            <div className="flex flex-col sm:flex-row items-center justify-center w-full">
              <div className="grid grid-cols-1 gap-4">
                <label htmlFor="customer_id" className="text-gray-700 dark:text-gray-200">
                  ID Cliente
                  <select
                    id="customer_id"
                    name="customer_id"
                    className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                    onChange={(e) => setNewOrder({ ...newOrder, customer_id: parseInt(e.target.value, 10) })}
                  >
                    <option value="">Sin especificar</option>
                    {customers?.results.map((customer: Customer) => (
                      <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                  </select>

                </label>
                <label htmlFor="products" className="text-gray-700 dark:text-gray-200">
                  Productos
                  {newOrderItemsPost.map((orderItem, idx) => {
                    const uniqueKey = `orderItem_${idx}`;
                    return (
                      <div key={uniqueKey} className="flex flex-col sm:flex-row items-center justify-center w-full">
                        <select
                          id={`product_id_${uniqueKey}`}
                          name={`product_id_${uniqueKey}`}
                          className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                          onChange={(e) => handleOrderItemChange(e, idx, 'product_id')}
                        >
                          <option value="0">Sin especificar</option>
                          {products?.results.map((product: Product) => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          id={`quantity_${uniqueKey}`}
                          name={`quantity_${uniqueKey}`}
                          className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                          onChange={(e) => handleOrderItemChange(e, idx, 'quantity')}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOrderItem(idx)}
                          className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 dark:bg-gray-800"
                        >
                          <FiMinusCircle />
                        </button>
                      </div>
                    );
                  })}

                  <button type="button" onClick={handleAddOrderItem} className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 dark:bg-gray-800">
                    <FiPlusCircle />
                  </button>
                </label>
                <label htmlFor="status" className="text-gray-700 dark:text-gray-200">
                  Estado
                  {' '}
                  <select
                    id="status"
                    name="status"
                    className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                    onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value.toUpperCase() })}
                  >
                    <option value="">Sin especificar</option>
                    <option value="P">Pendiente</option>
                    <option value="R">En progresso</option>
                    <option value="D">Entregado</option>
                    <option value="C">Cancelado</option>
                  </select>

                </label>

                <label htmlFor="delivery_rule" className="text-gray-700 dark:text-gray-200">
                  Regla de entrega
                  <select
                    id="delivery_rule"
                    name="delivery_rule"
                    className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                    onChange={(e) => setNewOrder({ ...newOrder, delivery_rule: e.target.value.toUpperCase() })}
                  >
                    <option value="">Sin especificar</option>
                    <option value="H">Entrega en casa</option>
                    <option value="P">Recogida en tienda</option>
                  </select>
                </label>
                <label htmlFor="observations" className="text-gray-700 dark:text-gray-200">
                  Observaciones
                  <input
                    type="text"
                    id="observations"
                    name="observations"
                    className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                    onChange={(e) => setNewOrder({ ...newOrder, observations: e.target.value })}
                  />
                </label>
                <label htmlFor="paid" className="text-gray-700 dark:text-gray-200">
                  Pagado
                  {' '}
                  <input
                    type="checkbox"
                    id="paid"
                    name="paid"
                    className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                    onChange={(e) => setNewOrder({ ...newOrder, paid: e.target.checked })}
                  />

                </label>

                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={isCreatingOrder || !newOrder.status || !newOrder.delivery_rule}
                >
                  {isCreatingOrder ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="overflow-x-auto bg-white w-full p-4 flex-grow dark:bg-black">

          <div className="bg-white dark:bg-black p-4">
            <h1 className="text-xl sm:text-3xl mb-6 text-center font-bold">Filtros</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label htmlFor="customerName" className="text-gray-700 dark:text-gray-200">
                Cliente
                <select
                  id="customerName"
                  name="customerName"
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-full dark:bg-gray-800"
                  value={filters.customerName}
                  onChange={handleFilterChange}
                >
                  <option value="">Sin especificar</option>
                  {customers?.results.map((customer: Customer) => (
                    <option key={customer.id} value={customer.name}>{customer.name}</option>
                  ))}
                </select>
              </label>
              <label htmlFor="status" className="text-gray-700 dark:text-gray-200">
                Estado
                <select
                  id="status"
                  name="status"
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-full dark:bg-gray-800"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">Sin especificar</option>
                  <option value="P">Pendiente</option>
                  <option value="R">En progresso</option>
                  <option value="D">Entregado</option>
                  <option value="C">Cancelado</option>
                </select>
              </label>
              <label htmlFor="deliveryRule" className="text-gray-700 dark:text-gray-200">
                Regla de entrega
                <select
                  id="deliveryRule"
                  name="deliveryRule"
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-full dark:bg-gray-800"
                  value={filters.deliveryRule}
                  onChange={handleFilterChange}
                >
                  <option value="">Sin especificar</option>
                  <option value="H">Entrega en casa</option>
                  <option value="P">Recogida en tienda</option>
                </select>
              </label>
            </div>
          </div>
          <h1 className="text-xl sm:text-3xl mb-6 text-center font-bold">Pedidos</h1>
          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto min-h-max dark:bg-gray-800 dark:text-white">
              <div className="flex flex-col sm:table bg-gray-100 rounded-lg dark:bg-gray-800 dark:rounded-lg w-full">
                <div className="flex flex-col sm:table-row">
                  <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">Numero de pedido</div>
                  <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">Nombre del cliente</div>
                  <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">Fecha de creación</div>
                  <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">Estado</div>
                  <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">Pagado</div>
                  <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">Regla de entrega</div>
                  <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">Observaciones</div>
                  <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">Costo total</div>
                  <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">Detalle</div>
                </div>
                {/* order the orders by date */}
                {filteredOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((order: OrderGet) => (
                  <div className="flex flex-col sm:table-row" key={order.id}>
                    <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2">{order.id}</div>
                    <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700">{order.customer.name}</div>
                    <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2">{order.date}</div>
                    <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700">{order.status}</div>
                    <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2">{order.paid.toString()}</div>
                    <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700">{order.delivery_rule}</div>
                    <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2">{order.observations}</div>
                    <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700">{order.total_cost}</div>
                    <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2">
                      <button onClick={() => goToDetail(order.id)} type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                        <FiSearch size={24} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-black p-4">
              <h1 className="text-xl sm:text-3xl mb-6 text-center font-bold">No hay pedidos</h1>
              <p className="text-center">No hay pedidos que coincidan con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
