import { useState } from "react";
// import Chart from "chart.js/auto";
import axios from "axios";
import Link from "next/link";
// Define TypeScript interfaces for the data
//  Fixed Deployment
interface TrafficHistory {
  date: string;
  organic: number;
}

interface TopPage {
  url: string;
  traffic: number;
  share: number;
}

interface TopCountry {
  country: string;
  share: number;
}

interface TopKeyword {
  keyword: string;
  position: number;
  traffic: number;
}

interface Email {
  first_name: string;
  last_name: string;
  email: string;
  linkedin: string;
  role: string;
  website: string; // Added to match the contacts table
}

interface Site {
  domain: string;
  dr: number;
  url_rating: number;
  backlinks: number;
  refdomains: number;
  dofollow_backlinks: number;
  dofollow_refdomains: number;
  traffic_history: TrafficHistory[];
  traffic_monthly_avg: number;
  traffic_cost_monthly_avg: number;
  top_pages: TopPage[];
  top_countries: TopCountry[];
  top_keywords: TopKeyword[];
  emails: Email[];
  industry: string;
  relevancy: string;
  score: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const [step, setStep] = useState<number>(1); // Track the current step
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [targetDomain, setTargetDomain] = useState<string>("");
  const [targetIndustry, setTargetIndustry] = useState<string>("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]); // Track multiple selected domains
  const [selectedContacts, setSelectedContacts] = useState<Email[]>([]); // Contacts for selected domains
  const [selectedContactsForEmail, setSelectedContactsForEmail] = useState<
    string[]
  >([]); // Track selected contact emails
  const [senderEmail, setSenderEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const totalSteps = 4; // Total number of steps (we’ll implement Step 4 later)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      console.error("Please upload a CSV file!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("target_domain", targetDomain);
    formData.append("target_industry", targetIndustry);
    formData.append("csv_file", csvFile);

    try {
      const response = await axios.post<{ results: Site[] }>(
        `${API_URL}/analyze`, // Use the API_URL environment variable
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSites(response.data.results);
      setStep(2); // Move to Step 2
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDomainToggle = (domain: string) => {
    setSelectedDomains(
      (prev) =>
        prev.includes(domain)
          ? prev.filter((d) => d !== domain) // Deselect if already selected
          : [...prev, domain] // Select if not already selected
    );
  };

  const handleFetchEmails = async () => {
    if (selectedDomains.length === 0) {
      alert("Please select at least one domain to fetch emails for.");
      return;
    }

    setLoading(true);
    const allContacts: Email[] = [];

    try {
      // Only fetch emails for domains that haven't been fetched yet
      const domainsToFetch = selectedDomains.filter((domain) => {
        const site = sites.find((s) => s.domain === domain);
        return !site?.emails || site.emails.length === 0;
      });

      for (const domain of domainsToFetch) {
        const response = await axios.get<{ domain: string; emails: Email[] }>(
          `${API_URL}/fetch-emails/${domain}`
        );
        setSites((prevSites) =>
          prevSites.map((site) =>
            site.domain === domain
              ? { ...site, emails: response.data.emails }
              : site
          )
        );
        allContacts.push(...response.data.emails);
      }

      // Combine all contacts for selected domains (including previously fetched ones)
      const updatedContacts = selectedDomains
        .flatMap((domain) => {
          const site = sites.find((s) => s.domain === domain);
          return site?.emails || [];
        })
        .filter(
          (contact, index, self) =>
            index === self.findIndex((c) => c.email === contact.email) // Remove duplicates
        );

      setSelectedContacts(updatedContacts);
      setStep(3); // Move to Step 3
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 2) {
        setSelectedDomains([]); // Reset selected domains when going back to Step 1
      }
      if (step === 3) {
        // Don’t reset selectedContacts; we’ll reuse them if the user goes forward again
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <aside className="w-1/4 bg-blue-900 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Navigation</h2>
        <ul>
          <li className="py-2 hover:bg-blue-800 cursor-pointer">Dashboard</li>
          <li className="py-2 hover:bg-blue-800 cursor-pointer">
            <Link href="/upload-contacts">Upload Contacts</Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* Step Progress Indicator (Numbered Circles) */}
        <div className="mb-6 flex items-center space-x-4">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
            (stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < totalSteps && (
                  <div
                    className={`h-1 w-12 ${
                      step > stepNumber ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            )
          )}
        </div>
        <p className="text-gray-600 mb-4 text-black">
          {step === 1 &&
            "Step 1: Enter your target domain and upload a CSV file."}
          {step === 2 && "Step 2: Select domains to fetch contacts for."}
          {step === 3 && "Step 3: View contacts for the selected domains."}
          {step === 4 && "Step 4: Send an email to a contact (coming soon)."}
        </p>
        {step > 1 && (
          <button
            onClick={handleBack}
            className="mb-4 bg-gray-500 text-white p-2 rounded"
          >
            Back
          </button>
        )}

        {/* Step 1: User Input */}
        {step === 1 && (
          <form onSubmit={handleSubmit} className="mb-6 text-black">
            <div className="mb-4">
              <label className="block text-gray-700">Target Domain</label>
              <input
                type="text"
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Target Industry</label>
              <input
                type="text"
                value={targetIndustry}
                onChange={(e) => setTargetIndustry(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Upload CSV (Domains for Analysis)
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) =>
                  setCsvFile(e.target.files ? e.target.files[0] : null)
                }
                className="border p-2 w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Analyze
            </button>
          </form>
        )}

        {/* Step 2 */}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Select Domains: {sites.length} sites
            </h2>
            {loading ? (
              <div className="flex items-center justify-center">Loading...</div>
            ) : (
              <>
                {sites.map((site) => (
                  <div
                    key={site.domain}
                    className={`border p-4 rounded shadow bg-white cursor-pointer hover:bg-gray-100 ${
                      selectedDomains.includes(site.domain) ? "bg-blue-100" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event propagation
                      console.log("Toggling domain:", site.domain); // Debug log
                      handleDomainToggle(site.domain);
                    }}
                  >
                    <h2 className="text-xl font-semibold mb-2">
                      {site.domain}
                    </h2>
                    <p>
                      <strong>DR:</strong> {site.dr}
                    </p>
                    <p>
                      <strong>Traffic Monthly Avg:</strong>{" "}
                      {site.traffic_monthly_avg.toLocaleString()}
                    </p>
                    <div className="mb-4">
                      <h3 className="font-bold">Top Pages</h3>
                      <ul className="list-disc pl-5">
                        {site.top_pages.map((page, idx) => (
                          <li key={idx}>
                            {page.url} - {page.traffic.toLocaleString()} visits
                            ({(page.share * 100).toFixed(2)}%)
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleFetchEmails}
                  className="mt-4 bg-green-500 text-white p-2 rounded"
                  disabled={selectedDomains.length === 0}
                >
                  Fetch Emails for Selected Domains ({selectedDomains.length}{" "}
                  selected)
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 3 */}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Contacts for Selected Domains
            </h2>
            {loading ? (
              <div className="flex items-center justify-center">Loading...</div>
            ) : selectedContacts.length > 0 ? (
              <>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 p-2">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedContactsForEmail(
                                selectedContacts.map((c) => c.email)
                              );
                            } else {
                              setSelectedContactsForEmail([]);
                            }
                          }}
                          checked={
                            selectedContactsForEmail.length ===
                            selectedContacts.length
                          }
                        />
                      </th>
                      <th className="border border-gray-300 p-2">Website</th>
                      <th className="border border-gray-300 p-2">First Name</th>
                      <th className="border border-gray-300 p-2">Last Name</th>
                      <th className="border border-gray-300 p-2">Email</th>
                      <th className="border border-gray-300 p-2">LinkedIn</th>
                      <th className="border border-gray-300 p-2">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedContacts.map((contact, idx) => (
                      <tr key={idx} className="hover:bg-gray-100">
                        <td className="border border-gray-300 p-2">
                          <input
                            type="checkbox"
                            checked={selectedContactsForEmail.includes(
                              contact.email
                            )}
                            onChange={() => {
                              setSelectedContactsForEmail((prev) =>
                                prev.includes(contact.email)
                                  ? prev.filter(
                                      (email) => email !== contact.email
                                    )
                                  : [...prev, contact.email]
                              );
                            }}
                          />
                        </td>
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
                <button
                  onClick={() => setStep(4)}
                  className="mt-4 bg-blue-500 text-white p-2 rounded"
                  disabled={selectedContactsForEmail.length === 0}
                >
                  Send Email to Selected Contacts
                </button>
              </>
            ) : (
              <p>No contacts found for the selected domains.</p>
            )}
          </div>
        )}

        {/* Step 4: Placeholder for Email Sending (To Be Implemented Later) */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Send Email to Selected Contacts
            </h2>
            <p>Selected Contacts: {selectedContactsForEmail.join(", ")}</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const response = await axios.post(
                    `${API_URL}/send-email`, // Use the API_URL environment variable
                    {
                      to: selectedContactsForEmail,
                      from: senderEmail,
                      subject,
                      body,
                    },
                    { headers: { "Content-Type": "application/json" } }
                  );
                  alert(response.data.message);
                  // Reset the form and go back to Step 1
                  setSenderEmail("");
                  setSubject("");
                  setBody("");
                  setSelectedContactsForEmail([]);
                  setSelectedDomains([]);
                  setSelectedContacts([]);
                  setSites([]);
                  setStep(1);
                } catch (error: any) {
                  alert(error.response?.data?.error || "Failed to send email");
                } finally {
                  setLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700">
                  Your Email (Sender)
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="border p-2 w-full"
                  rows={5}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Email"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
