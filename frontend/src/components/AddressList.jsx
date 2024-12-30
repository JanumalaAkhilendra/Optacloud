import React from "react";

const AddressList = ({ addresses, onSelect, onDelete }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-lg font-semibold mb-4">Saved Addresses</h2>
      {addresses.map((address, index) => (
        <div key={index} className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-medium">{address.type}</h3>
            <p className="text-sm">
              {address.house}, {address.area}
            </p>
          </div>
          <div>
            <button
              onClick={() => onSelect(address)}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Select
            </button>
            <button
              onClick={() => onDelete(address)}
              className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;
