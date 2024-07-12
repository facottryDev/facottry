import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { ToggleButton } from "../global/ToggleButton";

interface TableProps {
  columns: TableColumn[];
  values: TableRow[];
}

const Table = ({ columns, values }: TableProps) => {
  return (
    <div className="overflow-x-auto min-h-full">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-200">
        <thead className="text-xs text-slate-700 dark:text-slate-200 uppercase border-b">
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col" className="px-6 py-3">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values.map((row, index) => (
            <tr key={index} className="border-b">
              {columns.map((column) => (
                <td
                  scope="row"
                  key={column}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  {
                    column === "Actions" ? (
                      <div className="flex items-center">
                        <ToggleButton />
                        <button
                          type="button"
                          className="ml-2 text-sm font-semibold leading-6 text-gray-900 dark:text-slate-200"
                        >
                          <AiFillEdit fontSize='1.3rem' />
                        </button>
                        <button
                          type="button"
                          className="text-sm font-semibold leading-6 ml-4 text-gray-900 dark:text-slate-200"
                        >
                          <AiFillDelete fontSize='1.3rem' />
                        </button>
                      </div>
                    ) : row[column]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
