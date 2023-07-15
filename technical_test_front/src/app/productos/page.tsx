/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */

'use client';

import React, { useState, useEffect } from 'react';
import {
  useFetchProductsQuery,
  useCreateProductMutation,
} from '@/redux/api';
import { FiSearch } from 'react-icons/fi';
import { useRouter, usePathname } from 'next/navigation';

import { Product } from '@/types';

function ProductPage() {
  const router = useRouter();
  const location = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    name: '',
    cost: 0,
  });
  const [filters, setFilters] = useState({
    name: '',
    cost: '',
  });
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const { data, isLoading: isFetching } = useFetchProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data) {
      const productsData = data.results as Product[];
      setProducts(productsData);
    }
  }, [data, location]);

  if (isFetching) <div>Loading...</div>;

  const goToDetail = (id: number) => {
    router.push(`/productos/${id}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await createProduct(newProduct).unwrap();
    if (response.id) {
      setProducts([...products, response]);
      setNewProduct({
        id: 0,
        name: '',
        cost: 0,
      });
    }
  };

  const filteredProducts = products.filter((product) => {
    const { name, cost } = filters;
    return product.name.toLowerCase().includes(name.toLowerCase())
      && product.cost.toString().includes(cost);
  });

  return (
    <div className="flex flex-col items-center justify-center h-5/6 bg-white dark:bg-black w-full sm:w-screen gap-4">
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Crear nuevo productos
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
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 dark:bg-gray-700 p-2 m-2 w-full"
                />
              </label>
              <label htmlFor="cost" className="text-gray-700 dark:text-gray-200">
                Costo
                <input
                  type="number"
                  name="cost"
                  id="cost"
                  value={newProduct.cost}
                  onChange={(e) => setNewProduct({ ...newProduct, cost: Number(e.target.value) })}
                  className="border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 dark:bg-gray-700 p-2 m-2 w-full"
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
          Filtrar productos
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center w-full bg-white dark:bg-black p-4">
          <div className="flex flex-col sm:flex-row items-center justify-center w-full">
            <div className="grid grid-cols-2 gap-4">
              <label htmlFor="name" className="text-gray-700 dark:text-gray-200">
                Nombre
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  className="border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 dark:bg-gray-700 p-2 m-2 w-full"
                />
              </label>
              <label htmlFor="cost" className="text-gray-700 dark:text-gray-200">
                Costo
                <input
                  type="number"
                  name="cost"
                  id="cost"
                  value={filters.cost}
                  onChange={(e) => setFilters({ ...filters, cost: e.target.value })}
                  className="border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 dark:bg-gray-700 p-2 m-2 w-full"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Lista de productos
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center w-full bg-white dark:bg-black p-4">
          <div className="flex flex-col sm:flex-row items-center justify-center w-full">
            {filteredProducts.length > 0 ? (
              <div className="overflow-x-auto min-h-max dark:bg-gray-800 dark:text-white">
                <div className="flex flex-col sm:table bg-gray-100 rounded-lg dark:bg-gray-800 dark:rounded-lg w-full">
                  <div className="flex flex-col sm:table-row">
                    <div className="flex flex-row sm:table-cell p-2 font-bold uppercase text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700">
                      Nombre
                    </div>
                    <div className="flex flex-row sm:table-cell p-2 font-bold uppercase text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700">
                      Costo
                    </div>
                    <div className="flex flex-row sm:table-cell p-2 font-bold uppercase text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700">
                      Detalle
                    </div>
                  </div>

                  {filteredProducts.sort((a, b) => a.id - b.id).map((product) => (
                    <div className="flex flex-col sm:table-row" key={product.id}>
                      <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 font-bold">{product.name}</div>
                      <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2">{product.cost}</div>
                      <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2">
                        <button
                          type="button"
                          onClick={() => goToDetail(product.id)}
                          className="w-full p-2 bg-red-500 text-white rounded-lg focus:outline-none focus:bg-red-400"
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
                  No se encontraron productos
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
