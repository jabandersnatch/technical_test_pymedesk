/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */

'use client';

import React, { useEffect, useState } from 'react';
import {
  useFetchOrderQuery,
  useFetchProductsQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from '@/redux/api';
import {
  OrderGet, OrderItemGet, OrderPost, Product,
} from '@/types';
import {
  FaPencilRuler, FaPlusCircle, FaMinusCircle,
} from 'react-icons/fa';
import { getToPost } from '@/types/order';
import { useRouter } from 'next/navigation';

function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderGet>();
  const [orderItems, setOrderItems] = useState<OrderItemGet[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const { data: productsData, isLoading: isLoadingProducts, error: errorProducts } = useFetchProductsQuery();
  const { data: orderData, isLoading: isLoadingOrder, error: errorOrder } = useFetchOrderQuery(params.id);

  useEffect(() => {
    if (orderData) {
      const orderGet = orderData as OrderGet;
      setOrder(orderGet);
      setOrderItems(orderGet.products);
    }
  }, [orderData]);

  if (isLoadingProducts || isLoadingOrder) {
    return <div>Loading...</div>;
  }

  if (errorProducts || errorOrder) {
    return <div>Error</div>;
  }

  const handleOrderItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number, field: 'product_id' | 'quantity') => {
    const newOrderItems = JSON.parse(JSON.stringify(orderItems)); // This creates a deep copy of the array
    if (field === 'product_id') {
      const product = productsData.results?.find((p: Product) => p.id === parseInt(e.target.value, 10));
      if (product) { newOrderItems[index].product = product as Product; }
    } else {
      const quantity = parseInt(e.target.value, 10);
      if (quantity) { newOrderItems[index].quantity = quantity; }
    }
    setOrderItems(newOrderItems);
  };

  const handleIsEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleAddOrderItem = () => {
    setOrderItems([...orderItems, {
      product: productsData.results?.[0] as Product, quantity: 1, batch_cost: 0, id: 0, order: 0,
    }]);
  };

  const handleRemoveOrderItem = (index: number) => {
    const newOrderItems = [...orderItems];
    newOrderItems.splice(index, 1);
    setOrderItems(newOrderItems);
  };

  const handleDeleteOrder = async () => {
    if (!order || order.id === undefined) {
      console.error('Order or order ID is undefined');
    } else {
      await deleteOrder(order.id);
      router.push('/pedidos');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!order || order.id === undefined) {
      console.error('Order or order ID is undefined');
      return;
    }

    const orderEdit = {
      ...order,
      products: orderItems,
    };

    const orderPost : OrderPost = getToPost(orderEdit);
    await updateOrder({ id: order.id, body: orderPost });
    router.push('/pedidos');
  };

  return (
    <div className="flex flex-col items-center justify-center h-5/6 bg-gray-100 dark:bg-black w-full sm:w-screen">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Detalle de pedido
      </h1>
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-2 p-2 rounded disabled:opacity-50"
        onClick={handleIsEditing}
      >
        {isEditing ? 'Cancelar' : 'Editar'}
        <FaPencilRuler className="inline ml-2" />
      </button>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center rounded-lg bg-white dark:bg-black p-4">
        <div className="flex flex-col sm:flex-row items-center justify-center bg-white dark:bg-gray-800 p-4">
          <div className="grid grid-cols-1 gap-4">
            <label className="text-sm font-bold mb-2" htmlFor="id">
              Order ID
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50"
                id="id"
                type="text"
                value={order?.id}
                disabled
              />
            </label>
            <label className="text-sm font-bold mb-2" htmlFor="client">
              Cliente
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50"
                id="client"
                type="text"
                value={order?.customer.name}
                disabled
              />
            </label>
            <label htmlFor="products" className="text-sm font-bold mb-2">
              Productos
              {orderItems.map((orderItem: OrderItemGet, index: number) => {
                const uniqueId = `product-${index}`;
                return (
                  <div key={uniqueId} className="flex flex-col sm:flex-row items-center justify-center bg-white dark:bg-gray-800 p-4">
                    <label className="text-sm font-bold mb-2 flex-col sm:flex-row items-center justify-center w-full" htmlFor="product_name">
                      Producto
                      <select
                        className="border rounded w-full p-2 m-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50"
                        id="product_name"
                        name="product_name"
                        value={orderItem.product.id}
                        disabled={!isEditing}
                        onChange={(e) => handleOrderItemChange(e, index, 'product_id')}
                      >
                        {productsData.results?.map((product: Product) => (
                          <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm font-bold mb-2" htmlFor="quantity">
                      Cantidad
                      <div className="flex flex-row items-center justify-center">
                        <input
                          className="shadow appearance-none border rounded w-full p-2 m-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50"
                          id="quantity"
                          type="number"
                          disabled={!isEditing}
                          value={orderItem.quantity}
                          onChange={(e) => handleOrderItemChange(e, index, 'quantity')}
                        />
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded disabled:opacity-50"
                          type="button"
                          onClick={() => handleRemoveOrderItem(index)}
                          disabled={!isEditing}
                        >
                          <FaMinusCircle />
                        </button>
                      </div>
                    </label>
                  </div>
                );
              })}
              <button
                className="bg-blue-500 dark:bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                type="button"
                onClick={handleAddOrderItem}
                disabled={!isEditing}
              >
                <FaPlusCircle />
              </button>
            </label>
            <label className="text-sm font-bold mb-2" htmlFor="status">
              Estado
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50"
                id="status"
                value={order?.status}
                name="status"
                disabled={!isEditing}
                onChange={(e) => {
                  if (!order) return;
                  setOrder({ ...order, status: e.target.value });
                }}
              >
                <option value="">Seleccione un estado</option>
                <option value="P">Pendiente</option>
                <option value="R">En progreso</option>
                <option value="D">Entregado</option>
                <option value="C">Cancelado</option>
              </select>
            </label>
            <label className="text-sm font-bold mb-2" htmlFor="delivery_rule">
              Regla de entrega
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50"
                id="delivery_rule"
                name="delivery_rule"
                value={order?.delivery_rule}
                disabled={!isEditing}
                onChange={(e) => {
                  if (!order) return;
                  setOrder({ ...order, delivery_rule: e.target.value });
                }}
              >
                <option value="">Seleccione una regla de entrega</option>
                <option value="H">Entrega en casa</option>
                <option value="S">Retiro en sucursal</option>
              </select>
            </label>
            <label className="text-sm font-bold mb-2" htmlFor="paid">
              Pagado
              <input
                className="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline p-2 m-2 dark:bg-gray-800 disabled:opacity-50"
                type="checkbox"
                id="paid"
                name="paid"
                checked={order?.paid}
                disabled={!isEditing}
                onChange={(e) => {
                  if (!order) return;
                  setOrder({ ...order, paid: e.target.checked });
                }}
              />
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="total_cost">
              Costo total
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50"
                id="total_cost"
                name="total_cost"
                type="number"
                value={order?.total_cost}
                disabled
              />
            </label>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              type="submit"
              disabled={!isEditing}
            >
              Guardar
            </button>
            <div className="flex flex-row items-center justify-center">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                type="button"
                onClick={handleDeleteOrder}
                disabled={!isEditing}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default OrderDetailPage;
