'use client';

import React from 'react';
import { useFetchSummaryQuery } from '@/redux/api';
import { Summary } from '@/types/summary';

function SummaryPage() {
  const { data, error, isLoading } = useFetchSummaryQuery();

  if (isLoading) return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  if (error) {
    return <div className="flex justify-center items-center h-screen"><p>Error</p></div>;
  }

  const summaryData = data as Summary;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-black w-full sm:w-screen">
      <h1 className="text-xl sm:text-3xl mb-6 text-center font-bold">Resumen</h1>
      {summaryData && (
        <div className="overflow-x-auto">
          <div className="flex flex-col sm:table bg-white rounded-lg dark:bg-gray-800 dark:rounded-lg w-full">
            <div className="flex flex-col sm:table-row">
              <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2">Número de pedidos:</div>
              <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700">{summaryData.num_orders}</div>
            </div>
            <div className="flex flex-col sm:table-row">
              <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2">Número de clientes:</div>
              <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700">{summaryData.num_customers}</div>
            </div>
            <div className="flex flex-col sm:table-row">
              <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2">Ciudad con más pedidos:</div>
              <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700">{summaryData.city_with_most_orders}</div>
            </div>
            <div className="flex flex-col sm:table-row">
              <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2">Ingresos del último mes:</div>
              <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700">{summaryData.last_month_income}</div>
            </div>
            <div className="flex flex-col sm:table-row">
              <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2">Producto más vendido:</div>
              <div className="flex flex-col sm:table-cell px-2 sm:px-4 py-2 bg-gray-200 dark:bg-gray-700">{summaryData.best_selling_product}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryPage;
