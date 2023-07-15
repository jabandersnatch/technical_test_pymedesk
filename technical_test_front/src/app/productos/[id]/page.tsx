/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */

'use client';

import React, { useState, useEffect } from 'react';
import {
  useFetchProductQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from '@/redux/api';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import { FaPencilRuler } from 'react-icons/fa';

function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>({
    id: 0,
    name: '',
    cost: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const { data, isLoading } = useFetchProductQuery(params.id);

  useEffect(() => {
    if (data) {
      const productData = data as Product;
      setProduct(productData);
    }
  }, [data]);

  if (isLoading) <div>Loading...</div>;

  const handleDelete = async () => {
    const response = await deleteProduct(product.id).unwrap();
    if (response.id) {
      router.push('/productos');
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await updateProduct({ id: product.id, body: product }).unwrap();
    if (response.id) {
      setIsEditing(false);
      router.push('/productos');
    }
  };

  const handleIsEditing = () => {
    setIsEditing(!isEditing);
  };

  return (

    <div className="flex flex-col items-center justify-center h-5/6 bg-gray-100 dark:bg-black w-full sm:w-screen">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Detalle de producto
      </h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleIsEditing}
        type="button"
      >
        {isEditing ? 'Cancelar' : 'Editar'}
        <FaPencilRuler className=" inline ml-2" />
      </button>
      <form onSubmit={handleUpdate} className="flex flex-col sm:flex-row items-center justify-center rounded-lg bg-white dark:bg-black p-4">
        <div className="flex flex-col sm:flex-row items-center justify-center bg-white dark:bg-gray-800 p-4">
          <div className="grid grid-cols-1 gap-4">
            <label className="text-sm font-bold mb-2" htmlFor="id">
              Id
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50"
                id="id"
                type="text"
                value={product.id}
                disabled
              />
            </label>
            <label className="text-sm font-bold mb-2" htmlFor="name">
              Nombre
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50"
                id="name"
                type="text"
                value={product.name}
                disabled={!isEditing}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
              />
            </label>
            <label className="text-sm font-bold mb-2" htmlFor="cost">
              Costo
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50"
                id="cost"
                type="number"
                value={product.cost}
                disabled={!isEditing}
                onChange={(e) => setProduct({ ...product, cost: Number(e.target.value) })}
              />
            </label>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
              disabled={!isEditing}
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

export default ProductDetailPage;
