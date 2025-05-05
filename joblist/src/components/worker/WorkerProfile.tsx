"use client";
import React, { useState } from "react";
import { FiEdit2, FiStar, FiCamera } from "react-icons/fi";
import Image from "next/image";

interface WorkerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  profileImage?: string;
}

export default function WorkerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [workerData, setWorkerData] = useState<WorkerData>({
    name: "Γιώργος Παπαδόπουλος",
    email: "giorgos@example.com",
    phone: "6912345678",
    address: "Αθήνα, Ελλάδα",
    bio: "Επαγγελματίας ηλεκτρολόγος με 10+ χρόνια εμπειρίας σε οικιακές και επαγγελματικές εγκαταστάσεις.",
    skills: ["Ηλεκτρολογικά", "Εγκαταστάσεις", "Επισκευές"],
    rating: 4.8,
    reviewCount: 27,
    profileImage: undefined, // No image initially
  });

  const [formData, setFormData] = useState<WorkerData>(workerData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData({ ...formData, skills });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWorkerData(formData);
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
          {/* Profile picture edit section */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-4xl overflow-hidden">
                {formData.profileImage ? (
                  <Image 
                    src={formData.profileImage} 
                    alt={formData.name}
                    width={160} 
                    height={160}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span>{formData.name.charAt(0)}</span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-[#FB7600] text-white p-2 rounded-full cursor-pointer">
                <FiCamera size={20} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Όνομα</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600] text-gray-500"
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
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600] text-gray-500"
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
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600] text-gray-500"
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
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600] text-gray-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Δεξιότητες (χωρισμένες με κόμμα)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills.join(", ")}
              onChange={handleSkillChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600] text-gray-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Βιογραφικό</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#FB7600] focus:border-[#FB7600] text-gray-500"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setFormData(workerData);
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
          {/* Profile header with larger image */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-5xl overflow-hidden shadow-md border-4 border-white">
              {workerData.profileImage ? (
                <Image 
                  src={workerData.profileImage} 
                  alt={workerData.name}
                  width={192} 
                  height={192}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-gray-500">{workerData.name.charAt(0)}</span>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-semibold text-gray-500">{workerData.name}</h3>
              <div className="flex items-center justify-center sm:justify-start text-yellow-500 mt-2">
                <FiStar className="fill-current" />
                <span className="ml-1 text-lg text-gray-700">
                  {workerData.rating} ({workerData.reviewCount} κριτικές)
                </span>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600">{workerData.bio}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Στοιχεία Επικοινωνίας</h4>
              <p className="text-gray-600">
                <strong>Email:</strong> {workerData.email}
              </p>
              <p className="text-gray-600">
                <strong>Τηλέφωνο:</strong> {workerData.phone}
              </p>
              <p className="text-gray-600">
                <strong>Διεύθυνση:</strong> {workerData.address}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Δεξιότητες</h4>
              <div className="flex flex-wrap gap-2">
                {workerData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-[#FB7600] px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 