"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

// Define expertise fields and regions
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

const plans = [
  {
    name: "Βασικό",
    price: "29.99",
    period: "μήνα",
    tokens: 50,
    features: [
      "50 tokens για ξεκλείδωμα αγγελιών",
      "Βασικό προφίλ",
      "Email υποστήριξη",
    ],
    recommended: false,
  },
  {
    name: "Επαγγελματικό",
    price: "59.99",
    period: "μήνα",
    tokens: 120,
    features: [
      "120 tokens για ξεκλείδωμα αγγελιών",
      "Προτεραιότητα στις αναζητήσεις",
      "Προφίλ με badge επαλήθευσης",
      "Τηλεφωνική υποστήριξη",
    ],
    recommended: true,
  },
  {
    name: "Premium",
    price: "99.99",
    period: "μήνα",
    tokens: 250,
    features: [
      "250 tokens για ξεκλείδωμα αγγελιών",
      "Κορυφαία θέση στις αναζητήσεις",
      "Προφίλ με badge premium",
      "Προτεραιότητα στην υποστήριξη 24/7",
      "Στατιστικά προβολών προφίλ",
    ],
    recommended: false,
  },
];

export default function WorkerSignup() {
  const [step, setStep] = useState(1);
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

  const handlePlanSelect = (planName: string) => {
    setFormData({ ...formData, selectedPlan: planName });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);
    // Redirect to success page or dashboard
    router.push("/worker/dashboard");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-32">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Εγγραφή ως <span className="text-[#FB7600]">Μάστορας</span>
        </h1>

        {/* Progress Bar */}
        <div className="w-full max-w-3xl mx-auto mb-12">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-[#FB7600] text-white" : "bg-gray-300"}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Προσωπικά Στοιχεία</span>
              </div>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-[#FB7600] text-white" : "bg-gray-300"}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Επιλογή Πλάνου</span>
              </div>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-[#FB7600] text-white" : "bg-gray-300"}`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Ολοκλήρωση</span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${((step - 1) / 2) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#FB7600]"
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
          {step === 1 && (
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
                <label className="block text-gray-700 mb-2">Περιοχές Εξυπηρέτησης</label>
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
                <label className="block text-gray-700 mb-2">Περιγραφή / Βιογραφικό</label>
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
                        <p className="mt-1 text-xs text-gray-500">Ανέβασμα φωτογραφίας</p>
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
          )}

          {step === 2 && (
            <div className="plan-selection">
              <h2 className="text-2xl font-semibold mb-6">Επιλογή Πλάνου</h2>
              <p className="text-gray-600 mb-6">
                Επίλεξε το πλάνο που ταιριάζει καλύτερα στις ανάγκες σου.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`border rounded-lg p-6 cursor-pointer transition-all ${
                      formData.selectedPlan === plan.name
                        ? "border-[#FB7600] shadow-lg"
                        : "border-gray-200 hover:border-[#FB7600] hover:shadow"
                    } ${plan.recommended ? "relative" : ""}`}
                    onClick={() => handlePlanSelect(plan.name)}
                  >
                    {plan.recommended && (
                      <div className="absolute top-0 right-0 bg-[#FB7600] text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                        Προτεινόμενο
                      </div>
                    )}
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-4 mb-6">
                      <span className="text-3xl font-bold">{plan.price}€</span>
                      <span className="text-gray-500">/{plan.period}</span>
                    </div>
                    <div className="mb-4">
                      <span className="inline-block bg-[#FB7600] bg-opacity-20 text-[#FB7600] px-3 py-1 rounded-full text-sm font-medium">
                        {plan.tokens} tokens
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-[#FB7600] mr-2 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="border border-[#FB7600] text-[#FB7600] px-6 py-2 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Πίσω
                </button>
                <button
                  onClick={nextStep}
                  disabled={!formData.selectedPlan}
                  className={`bg-[#FB7600] text-white px-6 py-2 rounded-lg transition-all ${
                    !formData.selectedPlan ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-90"
                  }`}
                >
                  Επόμενο
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="checkout">
              <h2 className="text-2xl font-semibold mb-6">Ολοκλήρωση Εγγραφής</h2>
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Σύνοψη Παραγγελίας</h3>
                <div className="flex justify-between mb-2">
                  <span>Πλάνο</span>
                  <span className="font-medium">{formData.selectedPlan}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Τιμή</span>
                  <span className="font-medium">
                    {plans.find((p) => p.name === formData.selectedPlan)?.price}€ / {plans.find((p) => p.name === formData.selectedPlan)?.period}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tokens</span>
                  <span className="font-medium">{plans.find((p) => p.name === formData.selectedPlan)?.tokens} tokens</span>
                </div>
                <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                  <span>Σύνολο</span>
                  <span>{plans.find((p) => p.name === formData.selectedPlan)?.price}€</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Στοιχεία Πληρωμής</h3>
                <div className="p-4 border rounded-lg bg-white">
                  {/* Stripe-like UI */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Αριθμός Κάρτας</label>
                    <div className="flex border rounded-lg overflow-hidden">
                      <input
                        type="text"
                        placeholder="1234 1234 1234 1234"
                        className="w-full px-4 py-2 focus:outline-none"
                      />
                      <div className="flex items-center px-3 bg-gray-50">
                        <Image src="/visa-icon.png" alt="Visa" width={24} height={16} className="mr-2" />
                        <Image src="/mastercard-icon.png" alt="Mastercard" width={24} height={16} />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Ημερομηνία Λήξης</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB7600]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB7600]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Όνομα στην Κάρτα</label>
                    <input
                      type="text"
                      placeholder="JOHN SMITH"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB7600]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <input type="checkbox" id="terms" className="mr-2" />
                <label htmlFor="terms" className="text-gray-700">
                  Αποδέχομαι τους <a href="#" className="text-[#FB7600]">Όρους Χρήσης</a> και την <a href="#" className="text-[#FB7600]">Πολιτική Απορρήτου</a>
                </label>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="border border-[#FB7600] text-[#FB7600] px-6 py-2 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Πίσω
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-[#FB7600] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Ολοκλήρωση Εγγραφής
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}