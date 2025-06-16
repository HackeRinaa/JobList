"use client";
import React, { useState, useRef } from "react";
import { FiEdit2, FiCamera } from "react-icons/fi";
import Image from "next/image";

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  imageUrl?: string;
}

export default function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "Ελένη Παπαδοπούλου",
    email: "eleni@example.com",
    phone: "6912345678",
    address: "Λεωφόρος Αλεξάνδρας 15",
    city: "Αθήνα",
    postalCode: "11521",
    imageUrl: undefined,
  });

  const [formData, setFormData] = useState<CustomerData>(customerData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerData(formData);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Το Προφίλ μου</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-[#FB7600] hover:text-orange-700"
          >
            <FiEdit2 className="mr-1" /> Επεξεργασία
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div 
                className="w-24 h-24 rounded-full overflow-hidden cursor-pointer"
                onClick={handleImageClick}
              >
                {formData.imageUrl ? (
                  <Image
                    src={formData.imageUrl}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <FiCamera className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <button 
                type="button"
                className="absolute bottom-0 right-0 bg-[#FB7600] text-white p-2 rounded-full hover:bg-orange-700"
                onClick={handleImageClick}
              >
                <FiCamera className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm text-gray-600">Επιλέξτε μια φωτογραφία προφίλ</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Ονοματεπώνυμο</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Τηλέφωνο</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Διεύθυνση</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Πόλη</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Ταχυδρομικός Κώδικας</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setFormData(customerData);
                setIsEditing(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Ακύρωση
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FB7600] text-white rounded-lg hover:bg-orange-700"
            >
              Αποθήκευση
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mr-4">
              {customerData.imageUrl ? (
                <Image
                  src={customerData.imageUrl}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl">
                  {customerData.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-500">{customerData.name}</h3>
              <p className="text-gray-600 mt-2">Πελάτης</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Στοιχεία Επικοινωνίας</h4>
              <p className="text-gray-600">
                <strong>Email:</strong> {customerData.email}
              </p>
              <p className="text-gray-600">
                <strong>Τηλέφωνο:</strong> {customerData.phone}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Διεύθυνση</h4>
              <p className="text-gray-600">{customerData.address}</p>
              <p className="text-gray-600">
                {customerData.city}, {customerData.postalCode}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 