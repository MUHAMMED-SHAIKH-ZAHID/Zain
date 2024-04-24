import { BiEdit } from 'react-icons/bi'; // For the edit button icon

const RecentInvoices = ({ invoices }) => {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-white mb-3">Recent Invoices</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Invoice Number
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Invoice Date
              </th>
            
              <th className="px-5 py-3 border-b-2 border-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.slice(0, 10).map(invoice => (
              <tr key={invoice.id}>
                <td className="px-5 py-5 border-b border-gray-700 text-sm text-white">
                  {invoice.id}
                </td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm text-white">
                  {invoice.customerName}
                </td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm text-white">
                  {invoice.sales_number}
                </td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm text-white">
                  {invoice.grand_total}
                </td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm text-white">
                  {invoice.sales_date}
                </td>
                
                <td className="px-5 py-5 border-b border-gray-700 text-sm text-white">
                  {invoice.status}
                </td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm text-white">
                  <button className="text-blue-500 hover:text-blue-700">
                    <BiEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentInvoices;
