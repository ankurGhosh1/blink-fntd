import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
interface Contact {
  website: string;
  first_name: string;
  last_name: string;
  email: string;
  linkedin: string;
  role: string;
}

export default function UploadContacts() {
  const [contactsCsvFile, setContactsCsvFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch contacts on page load
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ contacts: Contact[] }>(
        "http://localhost:5000/get-contacts"
      );
      setContacts(response.data.contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setUploadMessage("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  // Call fetchContacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const handleUploadContacts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactsCsvFile) {
      setUploadMessage("Please upload a CSV file!");
      return;
    }

    const formData = new FormData();
    formData.append("csv_file", contactsCsvFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload-contacts",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUploadMessage(response.data.message);
      // Refresh the contacts list after upload
      fetchContacts();
    } catch (error: any) {
      setUploadMessage(
        error.response?.data?.error || "Failed to upload contacts"
      );
      console.error("Error uploading contacts:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black overflow-hidden">
      {/* Sidebar */}
      <aside className="w-1/4 bg-blue-900 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Navigation</h2>
        <ul>
          <li className="py-2 hover:bg-blue-800 cursor-pointer">
            <Link href="/">Dashboard</Link>
          </li>
          <li className="py-2 hover:bg-blue-800 cursor-pointer">
            Upload Contacts
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-6">
        <h1 className="text-2xl font-bold mb-4">Upload and Manage Contacts</h1>

        {/* Form for Uploading Contacts CSV */}
        <form onSubmit={handleUploadContacts} className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700">Upload Contacts CSV</label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) =>
                setContactsCsvFile(e.target.files ? e.target.files[0] : null)
              }
              className="border p-2 w-full"
              required
            />
          </div>
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Upload Contacts
          </button>
          {uploadMessage && <p className="mt-2">{uploadMessage}</p>}
        </form>

        {/* Table of Current Contacts */}
        <div className="max-h-[70vh] overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Current Contacts</h2>
          {loading ? (
            <div className="flex items-center justify-center">Loading...</div>
          ) : contacts.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Website</th>
                  <th className="border border-gray-300 p-2">First Name</th>
                  <th className="border border-gray-300 p-2">Last Name</th>
                  <th className="border border-gray-300 p-2">Email</th>
                  <th className="border border-gray-300 p-2">LinkedIn</th>
                  <th className="border border-gray-300 p-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">
                      {contact.website}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {contact.first_name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {contact.last_name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {contact.email}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {contact.linkedin ? (
                        <a
                          href={contact.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500"
                        >
                          LinkedIn
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {contact.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No contacts found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
