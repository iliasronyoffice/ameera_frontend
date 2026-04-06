import { FiStar, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FaStar, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function AddressCard({ 
  address, 
  index, 
  isSelected, 
  onSelect, 
  onMakeDefault, 
  onEdit, 
  onDelete 
}) {
  
  
  return (
    <div 
      className={`border rounded-lg p-4 transition-all cursor-pointer ${
        isSelected 
          ? 'border-red-500 bg-red-50 shadow-md' 
          : 'border-gray-200 hover:border-red-300 hover:shadow'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              #{index.toString().padStart(2, '0')}
            </span>
            {address?.set_default === 1 && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded flex items-center gap-1">
                <FaStar className="w-3 h-3" />
                Default
              </span>
            )}
          </div>
          
          {/* Simple display - just show what we have */}
          <p className="text-sm text-gray-600">
            Address ID: {address?.id}
          </p>
          <p className="text-sm text-gray-600">
            Address: {address?.address || 'No address'}
          </p>
          <p className="text-sm text-gray-600">
            Phone: {address?.phone || 'No phone'}
          </p>
          <p className="text-sm text-gray-600">
            City: {address?.city_name || 'No city'}
          </p>
        </div>

        <input 
          type="radio" 
          name="selectedAddress" 
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-red-500 focus:ring-red-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
        {address?.set_default !== 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMakeDefault();
            }}
            className="text-xs text-gray-500 hover:text-yellow-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            <FiStar className="w-3 h-3" />
            Make Default
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
        >
          <FiEdit2 className="w-3 h-3" />
          Edit
        </button>
        {address?.set_default !== 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            <FiTrash2 className="w-3 h-3" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}