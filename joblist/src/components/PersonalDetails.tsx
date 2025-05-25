"use client";

import React, { useRef } from "react";
import RegionSelector from "./RegionSelector";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  expertise: string[];
  regions: string[];
  photo: File | null;
}

interface PersonalDetailsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleMultiSelect: (item: string, category: "expertise" | "regions") => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  expertiseFields: string[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  setFormData?: React.Dispatch<React.SetStateAction<FormData>>;
}

const PersonalDetails = ({
  formData,
  handleInputChange,
  handleMultiSelect,
  handleFileChange,
  nextStep,
  expertiseFields,
  fileInputRef,
}: PersonalDetailsProps) => {
  const bioTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to check if the button should be enabled
  const isButtonDisabled = () => {
    return !(
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.bio &&
      formData.expertise.length > 0 &&
      formData.regions.length > 0 &&
      formData.photo
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Προσωπικά Στοιχεία</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-800 mb-2">Όνομα</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB7600]"
          />
        </div>
        <div>
          <label className="block text-gray-800 mb-2">Επώνυμο</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB7600]"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-800 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB7600]"
          />
        </div>
        <div>
          <label className="block text-gray-800 mb-2">Τηλέφωνο</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB7600]"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-gray-800 mb-2">Φωτογραφία Προφίλ</label>
        <div className="flex items-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-[#FB7600]"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ανέβασμα φωτογραφίας
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          {formData.photo && (
            <span className="ml-3 text-sm text-gray-600">
              {formData.photo.name}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-gray-800 mb-2">Ειδικότητες</label>
        <div className="flex flex-wrap gap-2">
          {expertiseFields.map((field) => (
            <button
              key={field}
              type="button"
              onClick={() => handleMultiSelect(field, "expertise")}
              className={`px-3 py-1 rounded-full text-sm ${
                formData.expertise.includes(field)
                  ? "bg-[#FB7600] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {field}
            </button>
          ))}
        </div>
      </div>

      <RegionSelector formData={formData} handleMultiSelect={handleMultiSelect} />

      <div className="mt-6">
        <label className="block text-gray-800 mb-2">Περιγραφή / Βιογραφικό</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          ref={bioTextareaRef}
          rows={4}
          className="text-gray-600 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB7600]"
          placeholder="Περιγράψτε την εμπειρία σας και τις υπηρεσίες που προσφέρετε..."
        ></textarea>
      </div>

      <div className="mt-8">
        <button
          onClick={nextStep}
          disabled={isButtonDisabled()}
          className={`w-full py-3 rounded-lg text-white font-medium ${
            isButtonDisabled()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#FB7600] hover:bg-[#E56A00]"
          }`}
        >
          Επόμενο
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;