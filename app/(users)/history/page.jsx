"use client";

import {DataTable} from "../../components/History/Table";
import { columns } from "../../components/History/Columns";
import { data } from "../../components/History/data";

export default function HistoryPage() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">

      <h1 className="text-2xl font-semibold mb-6">
        Nutrition History
      </h1>

      <DataTable columns={columns} data={data} />

    </div>
  );
}