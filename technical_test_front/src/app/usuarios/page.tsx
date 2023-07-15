/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */

'use client';

import React, { useEffect, useState } from 'react';
import {
  useFetchCustomersQuery, useCreateCustomerMutation,
} from '@/redux/api';
import { FiSearch } from 'react-icons/fi';
import { useRouter, usePathname } from 'next/navigation';
import { Customer } from '@/types';

function CustomersPage() {
  const router = useRouter();
  const location = usePathname();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: 0,
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();
  const { data, isLoading: isFetching } = useFetchCustomersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data) {
      const customersData = data.results as Customer[];
      setCustomers(customersData);
    }
  }, [data, location]);

  if (isFetching) return <div>Loading...</div>;

  const goToDetail = (id: number) => {
    router.push(`/usuarios/${id}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await createCustomer(newCustomer).unwrap();
    if (response.id) {
      const newCustomerData = response as Customer;
      setCustomers([...customers, newCustomerData]);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const {
      name, phone, email, address, city,
    } = filters;
    return (
      customer.name.toLowerCase().includes(name.toLowerCase())
      && customer.phone.toLowerCase().includes(phone.toLowerCase())
      && customer.email.toLowerCase().includes(email.toLowerCase())
      && customer.address.toLowerCase().includes(address.toLowerCase())
      && customer.city.toLowerCase().includes(city.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col items-center justify-center h-5/6 bg-white dark:bg-black w-full sm:w-screen gap-4">
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Crear nuevo usuario
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center w-full bg-white dark:bg-black p-4">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="grid grid-cols-2 gap-4">
              <label htmlFor="name" className="text-gray-700 dark:text-gray-200">
                Nombre
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  value={newCustomer.name}
                />
              </label>
              <label htmlFor="phone" className="text-gray-700 dark:text-gray-200">
                Teléfono
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  value={newCustomer.phone}
                />
              </label>
              <label htmlFor="email" className="text-gray-700 dark:text-gray-200">
                Email
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  value={newCustomer.email}
                />
              </label>
              <label htmlFor="address" className="text-gray-700 dark:text-gray-200">
                Dirección
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  value={newCustomer.address}
                />
              </label>
              <label htmlFor="city" className="text-gray-700 dark:text-gray-200">
                Ciudad
                <input
                  type="text"
                  name="city"
                  id="city"
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                  onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                  value={newCustomer.city}
                />
              </label>
            </div>
            <div className="flex flex-col items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {isLoading ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Filtrar usuarios
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center w-full bg-white dark:bg-black p-4">
          <div className="flex flex-col sm:flex-row items-center justify-center w-full">
            <div className="grid grid-cols-3 gap-4">
              <label htmlFor="name" className="text-gray-700 dark:text-gray-200">
                Nombre
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  value={filters.name}
                />
              </label>
              <label htmlFor="phone" className="text-gray-700 dark:text-gray-200">
                Teléfono
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                  onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
                  value={filters.phone}
                />
              </label>
              <label htmlFor="email" className="text-gray-700 dark:text-gray-200">
                Email
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                  onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                  value={filters.email}
                />
              </label>
              <label htmlFor="address" className="text-gray-700 dark:text-gray-200">
                Dirección
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                  onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                  value={filters.address}
                />
              </label>
              <label htmlFor="city" className="text-gray-700 dark:text-gray-200">
                Ciudad
                <input
                  type="text"
                  name="city"
                  id="city"
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-2 m-2 w-full dark:bg-gray-800"
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  value={filters.city}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Usuarios
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center w-full bg-white dark:bg-black p-4">
          <div className="flex flex-col sm:flex-row items-center justify-center w-full">
            {filteredCustomers.length > 0 ? (
              <div className="overflow-x-auto min-h-max dark:bg-gray-800 dark:text-white">
                <div className="flex flex-col sm:table bg-gray-100 rounded-lg dark:bg-gray-800 dark:rounded-lg w-full">
                  <div className="flex flex-col sm:table-row">
                    <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">Nombre</div>
                    <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">Teléfono</div>
                    <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">Email</div>
                    <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">Dirección</div>
                    <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">Ciudad</div>
                    <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">Detalle</div>
                  </div>

                  {filteredCustomers.sort((a, b) => a.name.localeCompare(b.name)).map((customer) => (
                    <div className="flex flex-col sm:table-row" key={customer.id}>
                      <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">{customer.name}</div>
                      <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold bg-gray-200 dark:bg-gray-700">{customer.phone}</div>
                      <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">{customer.email}</div>
                      <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold bg-gray-200 dark:bg-gray-700">{customer.address}</div>
                      <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">{customer.city}</div>
                      <div className="flex flex-row sm:table-cell px-2 sm:px-4 py-2 font-bold bg-gray-200 dark:bg-gray-700">
                        <button
                          type="button"
                          className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 dark:bg-gray-700"
                          onClick={() => goToDetail(customer.id)}
                        >
                          <FiSearch size={24} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full">
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  No hay usuarios
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomersPage;
