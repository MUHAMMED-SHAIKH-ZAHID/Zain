import { BiEdit } from 'react-icons/bi'; // For the edit button icon

const RecentInvoices = ({ invoices }) => {
  // Function to determine badge color and glow effect based on status
  const getStatusBadgeStyle = (status) => {
    let badgeStyle = '';
    let glowEffect = '';

    switch (status) {
      case 'hold':
        badgeStyle = 'bg-orange-400';
        glowEffect = 'glow-orange';
        break;
      case 'Placed':
        badgeStyle = 'bg-green-400';
        glowEffect = 'glow-green';
        break;
      default:
        badgeStyle = 'bg-gray-400';
    }

    return `${badgeStyle} ${glowEffect}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg   border">
      <h2 className="text-xl font-medium leading-none  text-gray-800 mb-6">Recent Invoices</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Invoice Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Invoice Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.slice(0, 10).map(invoice => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                  {invoice.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                  {invoice.customer_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                  {invoice.sales_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                  {invoice.grand_total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                  {invoice.sales_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyle(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md pl-14 text-gray-900">
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
