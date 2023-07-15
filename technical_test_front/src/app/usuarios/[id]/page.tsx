/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */

'use client';

import React, { useEffect, useState } from 'react';
import {
  useFetchCustomerQuery,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
} from '@/redux/api';
import { Customer } from '@/types';
import { useRouter } from 'next/navigation';
import { FaPencilRuler } from 'react-icons/fa';

function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data, error, isLoading } = useFetchCustomerQuery(params.id);
  const [updateCustomer] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  useEffect(() => {
    if (data) {
      const customerData = data as Customer;
      setCustomer(customerData);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: error.message</div>;
  }

  if (!customer) {
    return <div>Customer not found</div>;
  }

  async function handleDelete() {
    if (!customer || customer.id === undefined) {
      console.log('Customer not found');
    } else {
      await deleteCustomer(customer.id);
      router.push('/usuarios');
    }
  }

  async function handleSubmit() {
    if (!customer || customer.id === undefined) {
      return;
    }

    const customerToUpdate = {
      ...customer,
    };

    await updateCustomer({ id: customer.id, body: customerToUpdate })
      .unwrap()
      .then(() => router.push('/usuarios'))
      .catch((err) => console.log(err));
  }

  const handleIsEditing = () => setIsEditing(!isEditing);

  return (

    <div className="flex flex-col items-center justify-center h-5/6 bg-gray-100 dark:bg-black w-full sm:w-screen">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Detalles del usuario
      </h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleIsEditing}
        type="button"
      >
        {isEditing ? 'Cancelar' : 'Editar'}
        <FaPencilRuler className=" inline ml-2" />
      </button>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center rounded-lg bg-white dark:bg-black p-4">
        <div className="flex flex-col sm:flex-row items-center justify-center bg-white dark:bg-gray-800 p-4">
          <div className="grid grid-cols-1 gap-4">
            <label className="text-sm font-bold mb-2" htmlFor="id">
              Id
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled
                id="id"
                name="id"
                type="text"
                value={customer.id}
              />
            </label>
            <label className="text-sm font-bold mb-2" htmlFor="name">
              Nombre
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={!isEditing}
                id="name"
                name="name"
                type="text"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
            </label>
            <label className="text-sm font-bold mb-2" htmlFor="email">
              Email
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={!isEditing}
                id="email"
                name="email"
                type="text"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              />
            </label>
            <label className="text-sm font-bold mb-2" htmlFor="phone">
              Teléfono
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={!isEditing}
                id="phone"
                name="phone"
                type="text"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              />
            </label>
            <label className="text-sm font-bold mb-2" htmlFor="address">
              Dirección
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={!isEditing}
                id="address"
                name="address"
                type="text"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
              />
            </label>
            <label className="text-sm font-bold mb-2" htmlFor="city">
              Ciudad
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={!isEditing}
                id="city"
                name="city"
                type="text"
                value={customer.city}
                onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
              />
            </label>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={!isEditing}
              type="submit"
            >
              Guardar
            </button>
            <div className="flex flex-row items-center justify-center">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                disabled={!isEditing}
                onClick={handleDelete}
                type="button"
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

export default CustomerDetailPage;
