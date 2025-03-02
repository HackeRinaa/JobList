import React, { useState } from "react";

interface FormData {
  jobType: string;
  location: "home" | "business";
  specialTools: boolean;
  jobDescription: string;
}

interface JobDetailsFormProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function JobDetailsForm({
  formData,
  updateFormData,
  onNext,
  onBack,
}: JobDetailsFormProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState(formData.jobType);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    updateFormData({ [name]: val });
  };

  const jobTypes = [
    { id: "installation", name: "Νέα εγκατάσταση" },
    { id: "repair", name: "Κατασκευή" },
    { id: "maintenance", name: "Συντηρηση" },
    { id: "upgrade", name: "Αναβάθμιση/Αντικατάσταση" },
    { id: "consultation", name: "Συμβουλή" },
    { id: "other", name: "Άλλο" },
  ];

  const handleJobTypeSelect = (type: string) => {
    setSelectedJobType(type);
    updateFormData({ jobType: type });
    setDropdownOpen(false);
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Πες μας για την εργασία σου
      </h2>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-lg font-medium text-gray-700">
            Είδος Εργασίας
          </label>
          <div className="relative">
            <div
              className="w-full text-gray-600 rounded-lg border border-gray-300 p-2 focus:border-[#FB7600] focus:outline-none focus:ring-1 focus:ring-[#FB7600] cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {selectedJobType || "Διάλεξε είδος εργασίας"}
            </div>

            {isDropdownOpen && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
                {jobTypes.map((type) => (
                  <li
                    key={type.id}
                    onClick={() => handleJobTypeSelect(type.name)}
                    className="text-gray-600 p-2 hover:bg-[#FB7600] hover:text-white cursor-pointer"
                  >
                    {type.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-lg font-medium text-gray-700">
            Τόπος
          </label>
          <div className="flex gap-4">
            <label className="flex items-center text-gray-600">
              <input
                type="radio"
                name="location"
                value="home"
                checked={formData.location === "home"}
                onChange={handleChange}
                className="mr-2 h-4 w-4 cursor-pointer" // Use accent-color
              />
              Οικία
            </label>
            <label className="flex items-center text-gray-600">
              <input
                type="radio"
                name="location"
                value="business"
                checked={formData.location === "business"}
                onChange={handleChange}
                className="mr-2 h-4 w-4 cursor-pointer" // Use accent-color
              />
              Επιχειρηματικός
            </label>
          </div>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="specialTools"
              checked={formData.specialTools}
              onChange={handleChange}
              className="mr-2 h-4 w-4 rounded cursor-pointer" // Use accent-color
            />
            <span className="text-gray-600 text-lg">
              Ειδικά εργαλεία ή εξοπλισμός απαιτείται
            </span>
          </label>
        </div>

        <div>
          <label className="mb-1 block text-lg font-semibold text-gray-600">
            Περιέγραψε την δουλειά
          </label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            rows={4}
            className="w-full text-gray-600 rounded-lg border border-gray-300 p-2 focus:border-[#FB7600] focus:outline-none focus:ring-1 focus:ring-[#FB7600]"
            placeholder="Περιγράψτε την εργασία σας λεπτομερώς. Ενσωματώστε οποιεσδήποτε συγκεκριμένες απαιτήσεις ή ανησυχίες."
            required
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
          disabled={!selectedJobType || !formData.jobDescription}
          className="rounded-lg bg-[#FB7600] px-6 py-2 font-medium text-white transition-colors hover:bg-[#E56A00] disabled:bg-gray-300"
        >
          Συνέχεια
        </button>
      </div>
    </div>
  );
}
