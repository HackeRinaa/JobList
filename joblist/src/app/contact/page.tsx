"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-700">
              Επικοινωνία
            </h1>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Χρειάζεστε βοήθεια; Είμαστε εδώ για εσάς! Επικοινωνήστε μαζί μας τώρα.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Form - Takes 3/5 of the width on large screens */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-700">
                  Στείλτε μας μήνυμα
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-600">
                        Ονοματεπώνυμο
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#FB7600] focus:ring-[#FB7600] focus:ring-1 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-600">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#FB7600] focus:ring-[#FB7600] focus:ring-1 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-600">
                      Τηλέφωνο
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#FB7600] focus:ring-[#FB7600] focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-600">
                      Θέμα
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#FB7600] focus:ring-[#FB7600] focus:ring-1 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-600">
                      Μήνυμα
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#FB7600] focus:ring-[#FB7600] focus:ring-1 focus:outline-none"
                      rows={4}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-lg transition-colors ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#FB7600] hover:bg-[#E56A00]"
                    } text-white font-medium`}
                  >
                    {isSubmitting ? "Αποστολή..." : "Αποστολή Μηνύματος"}
                  </button>

                  {submitStatus === "success" && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                      Το μήνυμά σας στάλθηκε! Θα σας απαντήσουμε σύντομα.
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                      Κάτι πήγε στραβά. Δοκιμάστε ξανά!
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Contact Information - Takes 2/5 of the width on large screens */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Contact */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl font-semibold mb-5 text-gray-700">
                  Γρήγορη Επικοινωνία
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <FaPhone className="text-[#FB7600] text-lg" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Τηλέφωνο</p>
                      <p className="text-gray-600">+30 210 1234567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <FaEnvelope className="text-[#FB7600] text-lg" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Email</p>
                      <p className="text-gray-600">support@joblist.gr</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <FaMapMarkerAlt className="text-[#FB7600] text-lg" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Διεύθυνση</p>
                      <p className="text-gray-600">Πλατεία Συντάγματος, Αθήνα 10563</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <FaClock className="text-[#FB7600] text-lg" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Ωράριο</p>
                      <p className="text-gray-600">Δευτέρα-Παρασκευή: 9:00-19:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl font-semibold mb-5 text-gray-700">
                  Βρείτε μας στα Social Media
                </h2>
                <div className="flex gap-4 flex-wrap">
                  <a 
                    href="#" 
                    className="bg-[#FB7600] bg-opacity-10 hover:bg-opacity-20 p-3 rounded-full transition-colors"
                  >
                    <FaFacebook className="text-[#FB7600] text-2xl" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-[#FB7600] bg-opacity-10 hover:bg-opacity-20 p-3 rounded-full transition-colors"
                  >
                    <FaInstagram className="text-[#FB7600] text-2xl" />
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 h-[300px] relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3145.2944258558823!2d23.7303238!3d37.9838201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bd3aec43a911%3A0xe92998bc102982c0!2sSyntagma%20Square!5e0!3m2!1sen!2sgr!4v1625123456789!5m2!1sen!2sgr"
                  className="absolute inset-0 w-full h-full rounded-xl"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
