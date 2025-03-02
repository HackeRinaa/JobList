import React from "react";

interface Address {
  street: string;
  number: string;
  city: string;
  postalCode: string;
  additionalInfo: string;
}

interface AddressFormProps {
  address: Address;
  updateAddress: (address: Address) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AddressForm({
  address,
  updateAddress,
  onNext,
  onBack,
}: AddressFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateAddress({ ...address, [name]: value });
  };

  const isFormValid = () => {
    return address.street && address.number && address.city;
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Που θα γίνει η εργασία?
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-lg font-medium text-gray-600">
            Οδός
          </label>
          <input
            type="text"
            name="street"
            value={address.street}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#FB7600] focus:outline-none focus:ring-1 focus:ring-[#FB7600]"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-lg font-medium text-gray-600">
            Αριθμός
          </label>
          <input
            type="text"
            name="number"
            value={address.number}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#FB7600] focus:outline-none focus:ring-1 focus:ring-[#FB7600]"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-lg font-medium text-gray-600">
            Πόλη
          </label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#FB7600] focus:outline-none focus:ring-1 focus:ring-[#FB7600]"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-lg font-medium text-gray-600">
            Πόλη
          </label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-[#FB7600] focus:outline-none focus:ring-1 focus:ring-[#FB7600]"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-lg font-medium text-gray-600">
            Πρόσθετες πληροφορίες (Υποχρεωτικά)
          </label>
          <textarea
            name="additionalInfo"
            value={address.additionalInfo}
            onChange={handleChange}
            rows={2}
            className="text-gray-500 w-full rounded-lg border border-gray-300 p-2 focus:border-[#FB7600] focus:outline-none focus:ring-1 focus:ring-[#FB7600]"
            placeholder="Αριθμός ορόφου, εισόδου, οδηγίες πρόσβασης, κ.λ.π."
          ></textarea>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-[#FB7600] hover:text-white hover:border-[#FB7600]"
        >
          Πίσω
        </button>
        <button
          onClick={onNext}
          disabled={!isFormValid()}
          className="rounded-lg bg-[#FB7600] px-6 py-2 font-medium text-white transition-colors hover:bg-[#E56A00] disabled:bg-gray-300"
        >
          Συνέχεια
        </button>
      </div>
    </div>
  );
} 