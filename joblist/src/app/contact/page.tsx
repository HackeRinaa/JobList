"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaTiktok,
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
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-600 ">
            Επικοινωνία
          </h1>
          <p className="text-gray-600  max-w-2xl mx-auto text-lg">
            Χρειάζεστε βοήθεια; Είμαστε εδώ για εσάς! Επικοινωνήστε μαζί μας
            τώρα.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white  p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-600">
              Στείλτε μας μήνυμα
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Ονοματεπώνυμο
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border text-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border text-gray-600 "
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-600 ">
                  Τηλέφωνο
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border text-gray-600 "
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-600 ">
                  Θέμα
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-600">
                  Μήνυμα
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border text-gray-600"
                  rows={5}
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
                } text-white`}
              >
                {isSubmitting ? "Αποστολή..." : "Αποστολή Μηνύματος"}
              </button>

              {submitStatus === "success" && (
                <div className="p-4 bg-green-100 text-green-700 rounded-lg">
                  Το μήνυμά σας στάλθηκε! Θα σας απαντήσουμε σύντομα.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                  Κάτι πήγε στραβά. Δοκιμάστε ξανά!
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-600">
                Γρήγορη Επικοινωνία
              </h2>
              <div className="space-y-4 grid grid-cols-2">
                <div className="flex items-center gap-4">
                  <FaPhone className="text-[#FB7600] text-xl" />
                  <div>
                    <p className="font-semibold text-[#FB7600]">Τηλέφωνο</p>
                    <p className="text-gray-600">+30 210 1234567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <FaEnvelope className="text-[#FB7600] text-xl" />
                  <div>
                    <p className="font-semibold text-[#FB7600]">Email</p>
                    <p className="text-gray-600">support@joblist.gr</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <FaInstagram className="text-[#FB7600] text-xl" />
                  <div>
                    <p className="font-semibold text-[#FB7600]">Instagram</p>
                    <p className="text-gray-600">joblist</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <FaFacebook className="text-[#FB7600] text-xl" />
                  <div>
                    <p className="font-semibold text-[#FB7600]">Facebook</p>
                    <p className="text-gray-600">joblist</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <FaTiktok className="text-[#FB7600] text-xl" />
                  <div>
                    <p className="font-semibold text-[#FB7600]">TikTok</p>
                    <p className="text-gray-600">joblist</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-600">
                Πώς Λειτουργούμε
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 text-md text-left">
                  🏠 <strong>Για Πελάτες:</strong> Αναζητήστε και βρείτε
                  επαγγελματίες για τις ανάγκες σας χωρίς καμία χρέωση. <br />
                  🔧 <strong>Για Επαγγελματίες:</strong> Δημιουργήστε ένα
                  προφίλ, επιλέξτε μια συνδρομή και αποκτήστε tokens για να
                  ξεκλειδώσετε εργασίες. <br />
                  💼 <strong>Απλό και Αποτελεσματικό:</strong> Οι πελάτες
                  δημοσιεύουν εργασίες και οι επαγγελματίες κάνουν αιτήσεις με
                  tokens. <br />
                  <br />
                  <strong className="text-lg text-[#FB7600]">
                    Βρείτε ή προσφέρετε υπηρεσίες με ευκολία!
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
