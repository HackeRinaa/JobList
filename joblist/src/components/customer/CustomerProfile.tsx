"use client";
import React, { useState, useRef } from "react";
import { FiEdit2, FiCamera } from "react-icons/fi";
import Image from "next/image";
import { useCustomerContext } from "@/contexts/CustomerContext";

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
  const { customerData, updateCustomerData, isLoading } = useCustomerContext();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert customerData to local form format
  const [formData, setFormData] = useState<CustomerData>({
    name: customerData?.name || "",
    email: customerData?.email || "",
    phone: customerData?.phone || "",
    address: customerData?.location || "",
    city: customerData?.city || "",
    postalCode: customerData?.postalCode || "",
    imageUrl: customerData?.imageUrl,
  });

  // Update form data when customerData changes
  React.useEffect(() => {
    if (customerData) {
      setFormData({
        name: customerData.name || "",
        email: customerData.email || "",
        phone: customerData.phone || "",
        address: customerData.location || "",
        city: customerData.city || "",
        postalCode: customerData.postalCode || "",
        imageUrl: customerData.imageUrl,
      });
    }
  }, [customerData]);

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

    if (!customerData?.email) {
      console.error('No customer email available');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('email', customerData.email);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateCustomerData({
        name: formData.name,
        phone: formData.phone,
        location: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        imageUrl: formData.imageUrl,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    if (customerData) {
      setFormData({
        name: customerData.name || "",
        email: customerData.email || "",
        phone: customerData.phone || "",
        address: customerData.location || "",
        city: customerData.city || "",
        postalCode: customerData.postalCode || "",
        imageUrl: customerData.imageUrl,
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB7600]"></div>
      </div>
    );
  }

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
                className="text-gray-800 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
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
                className="text-gray-800 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
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
                className="text-gray-800 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
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
                className="text-gray-800   w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
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
                className="text-gray-800 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
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
                className="text-gray-800 w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
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
              {formData.imageUrl ? (
                <Image
                  src={formData.imageUrl}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl">
                  {formData.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-500">{formData.name}</h3>
              <p className="text-gray-600 mt-2">Πελάτης</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Στοιχεία Επικοινωνίας</h4>
              <p className="text-gray-600">
                <strong>Email:</strong> {formData.email}
              </p>
              <p className="text-gray-600">
                <strong>Τηλέφωνο:</strong> {formData.phone}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Διεύθυνση</h4>
              <p className="text-gray-600">{formData.address}</p>
              <p className="text-gray-600">
                {formData.city}, {formData.postalCode}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 