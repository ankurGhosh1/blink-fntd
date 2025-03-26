// import { useState, useEffect } from "react"; // Ensure this is only imported once
// import Chart from "chart.js/auto";
// import axios from "axios";

// // Define TypeScript interfaces for the data
// interface TrafficHistory {
//   date: string;
//   organic: number;
// }

// interface TopPage {
//   url: string;
//   traffic: number;
//   share: number;
// }

// interface TopCountry {
//   country: string;
//   share: number;
// }

// interface TopKeyword {
//   keyword: string;
//   position: number;
//   traffic: number;
// }

// interface Email {
//   first_name: string;
//   last_name: string;
//   email: string;
//   linkedin: string;
//   role: string;
// }

// interface Site {
//   domain: string;
//   dr: number;
//   url_rating: number;
//   backlinks: number;
//   refdomains: number;
//   dofollow_backlinks: number;
//   dofollow_refdomains: number;
//   traffic_history: TrafficHistory[];
//   traffic_monthly_avg: number;
//   traffic_cost_monthly_avg: number;
//   top_pages: TopPage[];
//   top_countries: TopCountry[];
//   top_keywords: TopKeyword[];
//   emails: Email[];
//   industry: string;
//   relevancy: string;
//   score: number;
// }

// export default function Dashboard() {
//   const [sites, setSites] = useState<Site[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [targetDomain, setTargetDomain] = useState<string>("");
//   const [targetIndustry, setTargetIndustry] = useState<string>("");
//   const [csvFile, setCsvFile] = useState<File | null>(null);
//   const [contactsCsvFile, setContactsCsvFile] = useState<File | null>(null); // New state for contacts CSV
//   const [uploadMessage, setUploadMessage] = useState<string>(""); // Message for contacts upload

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!csvFile) {
//       console.error("Please upload a CSV file!");
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("target_domain", targetDomain);
//     formData.append("target_industry", targetIndustry);
//     formData.append("csv_file", csvFile);

//     try {
//       const response = await axios.post<{ results: Site[] }>(
//         "http://localhost:5000/analyze",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       setSites(response.data.results);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFindLeads = async (domain: string) => {
//     try {
//       const response = await axios.get<{ domain: string; emails: Email[] }>(
//         `http://localhost:5000/fetch-emails/${domain}`
//       );
//       setSites((prevSites) =>
//         prevSites.map((site) =>
//           site.domain === domain
//             ? { ...site, emails: response.data.emails }
//             : site
//         )
//       );
//     } catch (error) {
//       console.error(`Error fetching emails for ${domain}:`, error);
//     }
//   };

//   // New handler for uploading contacts CSV
//   const handleUploadContacts = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!contactsCsvFile) {
//       setUploadMessage("Please upload a CSV file!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("csv_file", contactsCsvFile);

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/upload-contacts",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       setUploadMessage(response.data.message);
//     } catch (error: any) {
//       setUploadMessage(
//         error.response?.data?.error || "Failed to upload contacts"
//       );
//       console.error("Error uploading contacts:", error);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100 text-black">
//       {/* Sidebar */}
//       <aside className="w-1/4 bg-blue-900 text-white p-4">
//         <h2 className="text-xl font-bold mb-4">Navigation</h2>
//         <ul>
//           <li className="py-2 hover:bg-blue-800 cursor-pointer">
//             Verified sites
//           </li>
//           <li className="py-2 hover:bg-blue-800 cursor-pointer">All sites</li>
//           <li className="py-2 hover:bg-blue-800 cursor-pointer">
//             Favorite publishers
//           </li>
//           <li className="py-2 hover:bg-blue-800 cursor-pointer">My projects</li>
//         </ul>
//       </aside>

//       {/* Main Content */}
//       <main className="w-3/4 p-6">
//         <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

//         {/* Form for Analysis */}
//         <form onSubmit={handleSubmit} className="mb-6">
//           <div className="mb-4">
//             <label className="block text-gray-700">Target Domain</label>
//             <input
//               type="text"
//               value={targetDomain}
//               onChange={(e) => setTargetDomain(e.target.value)}
//               className="border p-2 w-full"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Target Industry</label>
//             <input
//               type="text"
//               value={targetIndustry}
//               onChange={(e) => setTargetIndustry(e.target.value)}
//               className="border p-2 w-full"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">
//               Upload CSV (Domains for Analysis)
//             </label>
//             <input
//               type="file"
//               accept=".csv"
//               onChange={(e) =>
//                 setCsvFile(e.target.files ? e.target.files[0] : null)
//               }
//               className="border p-2 w-full"
//               required
//             />
//           </div>
//           <button type="submit" className="bg-blue-500 text-white p-2 rounded">
//             Analyze
//           </button>
//         </form>

//         {/* New Form for Uploading Contacts CSV */}
//         <form onSubmit={handleUploadContacts} className="mb-6">
//           <div className="mb-4">
//             <label className="block text-gray-700">Upload Contacts CSV</label>
//             <input
//               type="file"
//               accept=".csv"
//               onChange={(e) =>
//                 setContactsCsvFile(e.target.files ? e.target.files[0] : null)
//               }
//               className="border p-2 w-full"
//               required
//             />
//           </div>
//           <button type="submit" className="bg-green-500 text-white p-2 rounded">
//             Upload Contacts
//           </button>
//           {uploadMessage && <p className="mt-2">{uploadMessage}</p>}
//         </form>

//         {/* Loading or Results */}
//         {loading ? (
//           <div className="flex items-center justify-center">Loading...</div>
//         ) : (
//           <div className="space-y-6">
//             <h2 className="text-xl font-semibold">
//               Results: {sites.length} sites
//             </h2>
//             {sites.map((site) => (
//               <SiteCard
//                 key={site.domain}
//                 site={site}
//                 onFindLeads={() => handleFindLeads(site.domain)}
//               />
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// function SiteCard({
//   site,
//   onFindLeads,
// }: {
//   site: Site;
//   onFindLeads: () => void;
// }) {
//   const [showEmailForm, setShowEmailForm] = useState(false);
//   const [toEmail, setToEmail] = useState(site.emails[0]?.email || "");
//   const [subject, setSubject] = useState("");
//   const [content, setContent] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const ctx = document.getElementById(
//       `traffic-chart-${site.domain}`
//     ) as HTMLCanvasElement | null;
//     if (ctx) {
//       const chart = new Chart(ctx, {
//         type: "line",
//         data: {
//           labels: site.traffic_history.map((h) => h.date),
//           datasets: [
//             {
//               label: "Organic Traffic",
//               data: site.traffic_history.map((h) => h.organic),
//               borderColor: "blue",
//               fill: false,
//             },
//           ],
//         },
//         options: {
//           scales: {
//             y: { beginAtZero: true },
//           },
//         },
//       });
//       return () => chart.destroy();
//     }
//   }, [site]);

//   const handleSendEmail = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/api/send-email", {
//         to_email: toEmail,
//         subject,
//         content,
//       });
//       setMessage("Email sent successfully!");
//       setSubject("");
//       setContent("");
//     } catch (error) {
//       setMessage("Failed to send email.");
//       console.error("Error sending email:", error);
//     }
//   };

//   return (
//     <div className="border p-4 rounded shadow bg-white text-black">
//       <h2 className="text-xl font-semibold mb-2">{site.domain}</h2>
//       <p>
//         <strong>DR:</strong> {site.dr}
//       </p>
//       <p>
//         <strong>URL Rating:</strong> {site.url_rating}
//       </p>
//       <p>
//         <strong>Backlinks:</strong> {site.backlinks.toLocaleString()}
//       </p>
//       <p>
//         <strong>Ref Domains:</strong> {site.refdomains.toLocaleString()}
//       </p>
//       <p>
//         <strong>Dofollow Backlinks:</strong> {site.dofollow_backlinks}%
//       </p>
//       <p>
//         <strong>Dofollow Ref Domains:</strong> {site.dofollow_refdomains}%
//       </p>
//       <p>
//         <strong>Traffic Monthly Avg:</strong>{" "}
//         {site.traffic_monthly_avg.toLocaleString()}
//       </p>
//       <p>
//         <strong>Traffic Cost Monthly Avg:</strong> $
//         {site.traffic_cost_monthly_avg.toLocaleString()}
//       </p>
//       <p>
//         <strong>Industry:</strong> {site.industry}
//       </p>
//       <p>
//         <strong>Relevancy:</strong> {site.relevancy}
//       </p>
//       <p>
//         <strong>Score:</strong> {site.score}
//       </p>

//       {/* Traffic Graph */}
//       <div className="my-4">
//         <h3 className="font-bold">Traffic (Last 6 Months)</h3>
//         <canvas
//           id={`traffic-chart-${site.domain}`}
//           width="400"
//           height="200"
//         ></canvas>
//       </div>

//       {/* Top Pages */}
//       <div className="mb-4">
//         <h3 className="font-bold">Top Pages</h3>
//         <ul className="list-disc pl-5">
//           {site.top_pages.map((page, idx) => (
//             <li key={idx}>
//               {page.url} - {page.traffic.toLocaleString()} visits (
//               {(page.share * 100).toFixed(2)}%)
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Top Countries */}
//       <div className="mb-4">
//         <h3 className="font-bold">Top Countries</h3>
//         <ul className="list-disc pl-5">
//           {site.top_countries.map((country, idx) => (
//             <li key={idx}>
//               {country.country.toUpperCase()} -{" "}
//               {(country.share * 100).toFixed(2)}%
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Top Keywords */}
//       <div className="mb-4">
//         <h3 className="font-bold">Top Keywords</h3>
//         <ul className="list-disc pl-5">
//           {site.top_keywords.map((keyword, idx) => (
//             <li key={idx}>
//               {keyword.keyword} (Pos: {keyword.position}) -{" "}
//               {keyword.traffic.toLocaleString()} visits
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Email Contacts Section */}
//       <div className="mb-4">
//         <h3 className="font-bold">Email Contacts</h3>
//         {site.emails.length > 0 ? (
//           <div>
//             <ul className="list-disc pl-5">
//               {site.emails.map((email, idx) => (
//                 <li key={idx}>
//                   {email.first_name} {email.last_name} - {email.email} (
//                   {email.role})
//                   {email.linkedin && (
//                     <a
//                       href={email.linkedin}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-500 ml-2"
//                     >
//                       LinkedIn
//                     </a>
//                   )}
//                 </li>
//               ))}
//             </ul>
//             <button
//               onClick={() => setShowEmailForm(!showEmailForm)}
//               className="bg-blue-500 text-white p-2 rounded mt-2"
//             >
//               {showEmailForm ? "Hide Email Form" : "Send Email"}
//             </button>
//             {showEmailForm && (
//               <form onSubmit={handleSendEmail} className="mt-2">
//                 <input
//                   type="email"
//                   value={toEmail}
//                   onChange={(e) => setToEmail(e.target.value)}
//                   placeholder="To Email"
//                   className="border p-2 w-full mb-2"
//                   required
//                 />
//                 <input
//                   type="text"
//                   value={subject}
//                   onChange={(e) => setSubject(e.target.value)}
//                   placeholder="Subject"
//                   className="border p-2 w-full mb-2"
//                   required
//                 />
//                 <textarea
//                   value={content}
//                   onChange={(e) => setContent(e.target.value)}
//                   placeholder="Email Content"
//                   className="border p-2 w-full mb-2"
//                   required
//                 />
//                 <button
//                   type="submit"
//                   className="bg-green-500 text-white p-2 rounded"
//                 >
//                   Send
//                 </button>
//                 {message && <p className="mt-2">{message}</p>}
//               </form>
//             )}
//           </div>
//         ) : (
//           <p>
//             No emails found.{" "}
//             <button
//               onClick={onFindLeads}
//               className="bg-green-500 text-white p-1 rounded"
//             >
//               Find Marketing Leads
//             </button>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

// Define TypeScript interfaces for the data
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
        "http://localhost:5000/analyze",
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

  // const handleFetchEmails = async () => {
  //   if (selectedDomains.length === 0) {
  //     alert("Please select at least one domain to fetch emails for.");
  //     return;
  //   }

  //   setLoading(true);
  //   const allContacts: Email[] = [];

  //   try {
  //     for (const domain of selectedDomains) {
  //       const response = await axios.get<{ domain: string; emails: Email[] }>(
  //         `http://localhost:5000/fetch-emails/${domain}`
  //       );
  //       setSites((prevSites) =>
  //         prevSites.map((site) =>
  //           site.domain === domain
  //             ? { ...site, emails: response.data.emails }
  //             : site
  //         )
  //       );
  //       allContacts.push(...response.data.emails);
  //     }
  //     setSelectedContacts(allContacts);
  //     setStep(3); // Move to Step 3
  //   } catch (error) {
  //     console.error("Error fetching emails:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleBack = () => {
  //   if (step > 1) {
  //     setStep(step - 1);
  //     if (step === 2) {
  //       setSelectedDomains([]); // Reset selected domains when going back to Step 1
  //     }
  //     if (step === 3) {
  //       setSelectedContacts([]); // Reset selected contacts when going back to Step 2
  //     }
  //   }
  // };

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
          `http://localhost:5000/fetch-emails/${domain}`
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
            <a href="/upload-contacts">Upload Contacts</a>
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

        {/* Step 2: Domain Selection (Allow Multiple Selections) */}
        {/* {step === 2 && (
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
                    onClick={() => handleDomainToggle(site.domain)}
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
                  Fetch Emails for Selected Domains
                </button>
              </>
            )}
          </div>
        )} */}
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
                    onClick={() => handleDomainToggle(site.domain)}
                  >
                    <a
                      href={site.domain}
                      className="text-xl font-semibold mb-2"
                    >
                      {site.domain}
                    </a>
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
                  Fetch Emails for Selected Domains
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 3: Display Contacts for Selected Domains */}
        {/* {step === 3 && (
          <div className="space-y-6 text-black">
            <h2 className="text-xl font-semibold">
              Contacts for Selected Domains
            </h2>
            {loading ? (
              <div className="flex items-center justify-center">Loading...</div>
            ) : selectedContacts.length > 0 ? (
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
                  {selectedContacts.map((contact, idx) => (
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
              <p>No contacts found for the selected domains.</p>
            )}
          </div>
        )} */}

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
                    "http://localhost:5000/send-email",
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

// Remove the SiteCard component since we’re not using it in this flow anymore
