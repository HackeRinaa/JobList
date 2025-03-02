"use client";

import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function PersonalDetailsForm({ onNext }: { onNext: () => void }) {
  const expertiseFields = [
    "Υδραυλικός",
    "Ηλεκτρολόγος",
    "Ελαιοχρωματιστής",
    "Ξυλουργός",
    "Κηπουρός",
    "Καθαριστής",
    "Μετακομίσεις",
    "Κλιματισμός",
    "Πλακάς",
    "Αλουμινάς",
    "Σιδεράς",
    "Τζαμάς",
  ];

  const regions = [
    "Αθήνα",
    "Θεσσαλονίκη",
    "Πάτρα",
    "Ηράκλειο",
    "Λάρισα",
    "Βόλος",
    "Ιωάννινα",
    "Χανιά",
    "Καβάλα",
    "Σέρρες",
    "Χαλκίδα",
    "Αλεξανδρούπολη",
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    expertise: [],
    regions: [],
    photo: null,
    selectedPlan: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (item: string, category: "expertise" | "regions") => {
    setFormData((prev) => {
      const currentItems = [...prev[category]];
      if (currentItems.includes(item)) {
        return { ...prev, [category]: currentItems.filter((i) => i !== item) };
      } else {
        return { ...prev, [category]: [...currentItems, item] };
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  const nextStep = () => {
    onNext();
  };


  return (
    <div className="personal-details">
      <h2 className="text-2xl font-semibold mb-6">Προσωπικά Στοιχεία</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-2">Όνομα</label>
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
          <label className="block text-gray-700 mb-2">Επώνυμο</label>
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
          <label className="block text-gray-700 mb-2">Τηλέφωνο</label>
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
        <label className="block text-gray-700 mb-2">Ειδικότητες</label>
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

      <div className="mt-6">
        <label className="block text-gray-700 mb-2">
          Περιοχές Εξυπηρέτησης
        </label>
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => handleMultiSelect(region, "regions")}
              className={`px-3 py-1 rounded-full text-sm ${
                formData.regions.includes(region)
                  ? "bg-[#FB7600] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-gray-700 mb-2">
          Περιγραφή / Βιογραφικό
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB7600]"
          placeholder="Περιγράψτε την εμπειρία σας και τις υπηρεσίες που προσφέρετε..."
        ></textarea>
      </div>

      <div className="mt-6">
        <label className="block text-gray-700 mb-2">Φωτογραφία Προφίλ</label>
        <div className="flex items-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#FB7600]"
          >
            {formData.photo ? (
              <img
                src={URL.createObjectURL(formData.photo as any)}
                alt="Profile preview"
                className="w-full h-full object-cover rounded-lg"
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
                <p className="mt-1 text-xs text-gray-500">
                  Ανέβασμα φωτογραφίας
                </p>
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
          className="bg-[#FB7600] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all"
        >
          Επόμενο
        </button>
      </div>
    </div>
  );
}
