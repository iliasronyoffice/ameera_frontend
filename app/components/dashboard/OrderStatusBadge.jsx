export default function OrderStatusBadge({ status, type }) {
  const getStatusConfig = () => {
    if (type === 'payment') {
      const configs = {
        'Paid': 'bg-green-100 text-green-800',
        'Un-Paid': 'bg-red-100 text-red-800',
        'unpaid': 'bg-red-100 text-red-800',
      };
      return {
        className: configs[status] || 'bg-gray-100 text-gray-800',
        label: status === 'unpaid' ? 'Un-Paid' : status
      };
    } else {
      const configs = {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Processing': 'bg-blue-100 text-blue-800',
        'pending': 'bg-yellow-100 text-yellow-800',
      };
      return {
        className: configs[status] || 'bg-gray-100 text-gray-800',
        label: status === 'pending' ? 'Pending' : status
      };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-4 ${config.className}`}>
      {config.label}
    </span>
  );
}