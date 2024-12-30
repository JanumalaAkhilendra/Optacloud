/* eslint-disable react/prop-types */
import { useState } from "react";

const AddressForm = ({ onSave }) => {
  const [form, setForm] = useState({
    house: "",
    area: "",
    type: "Home",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded">
      <div className="mb-4">
        <label className="block text-sm font-medium">
          House/Flat/Block No.
        </label>
        <input
          type="text"
          name="house"
          value={form.house}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Apartment/Road/Area</label>
        <input
          type="text"
          name="area"
          value={form.area}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Address Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Home">Home</option>
          <option value="Office">Office</option>
          <option value="Friends & Family">Friends & Family</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Save Address
      </button>
    </form>
  );
};

export default AddressForm;
