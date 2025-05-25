"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import RegionSelector from "./RegionSelector";
import { extractCVData, summarizeCVText } from "../services/cvExtractor";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  expertise: string[];
  regions: string[];
  photo: File | null;
  cv: File | null;
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

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  formData,
  handleInputChange,
  handleMultiSelect,
  handleFileChange,
  nextStep,
  expertiseFields,
  fileInputRef,
  setFormData,
}) => {
  const [isProcessingCV, setIsProcessingCV] = useState(false);
  const [cvExtractedText, setCvExtractedText] = useState<string | null>(null);
  const cvFileInputRef = useRef<HTMLInputElement>(null);
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

  // Handle CV file upload
  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Call the original handleFileChange
    handleFileChange(e);
    
    try {
      setIsProcessingCV(true);
      
      // Extract text from the CV
      const data = await extractCVData(file);
      setCvExtractedText(data.extractedText);
      
      // If we have a summary, update the bio field
      if (data.summary && bioTextareaRef.current) {
        const bioText = data.summary || ""; // Ensure it's not undefined
        
        // Update the textarea directly
        bioTextareaRef.current.value = bioText;
        
        // Create a synthetic change event for the textarea
        const event = new Event('input', { bubbles: true });
        bioTextareaRef.current.dispatchEvent(event);
        
        // If setFormData is available, use it directly
        if (setFormData) {
          setFormData(prev => ({
            ...prev,
            bio: bioText
          }));
        }
      }
    } catch (error) {
      console.error("Error processing CV:", error);
    } finally {
      setIsProcessingCV(false);
    }
  };

  // Function to generate a bio from the CV text
  const generateBioFromCV = async () => {
    if (!cvExtractedText) return;
    
    try {
      setIsProcessingCV(true);
      const summary = await summarizeCVText(cvExtractedText);
      const bioText = summary || ""; // Ensure it's not undefined
      
      // Update the textarea and form data
      if (bioTextareaRef.current) {
        bioTextareaRef.current.value = bioText;
        
        // Create a synthetic change event for the textarea
        const event = new Event('input', { bubbles: true });
        bioTextareaRef.current.dispatchEvent(event);
        
        // If setFormData is available, use it directly
        if (setFormData) {
          setFormData(prev => ({
            ...prev,
            bio: bioText
          }));
        }
      }
    } catch (error) {
      console.error("Error generating bio:", error);
    } finally {
      setIsProcessingCV(false);
    }
  };

  return (
    <div className="personal-details">
      <h2 className="text-2xl font-semibold mb-6 text-gray-600">Προσωπικά Στοιχεία</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-800 mb-2">Όνομα</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB7600]"
            required
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
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB7600]"
            required
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
            required
          />
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

      {/* CV Upload Section */}
      <div className="mt-6">
        <label className="block text-gray-800 mb-2">Βιογραφικό (PDF)</label>
        <div className="flex items-center">
          <button
            onClick={() => cvFileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-[#FB7600]"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ανέβασμα βιογραφικού
          </button>
          <input
            type="file"
            ref={cvFileInputRef}
            onChange={handleCVUpload}
            accept=".pdf"
            className="hidden"
          />
          {formData.cv && (
            <span className="ml-3 text-sm text-gray-600">
              {formData.cv.name}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-gray-800">Περιγραφή / Βιογραφικό</label>
          {cvExtractedText && (
            <button
              type="button"
              onClick={generateBioFromCV}
              disabled={isProcessingCV}
              className="text-sm text-[#FB7600] hover:text-[#E56A00] flex items-center"
            >
              {isProcessingCV ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#FB7600]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              Δημιουργία με AI
            </button>
          )}
        </div>
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

      <div className="mt-6">
        <label className="block text-gray-800 mb-2">Φωτογραφία Προφίλ</label>
        <div className="flex items-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#FB7600]"
          >
            {formData.photo ? (
              <Image
                src={URL.createObjectURL(formData.photo as File)}
                alt="Profile preview"
                className="w-full h-full object-cover rounded-lg"
                width={128}
                height={128}
              />
            ) : (
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-1 text-xs text-gray-600">Ανέβασμα φωτογραφίας</p>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={nextStep}
          disabled={isButtonDisabled()}
          className={`bg-[#FB7600] text-white px-6 py-2 rounded-lg hover:bg-[#E56A00] transition-colors ${
            isButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Επόμενο
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;