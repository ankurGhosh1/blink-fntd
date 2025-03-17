import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

type Result = {
  domain: string;
  traffic: number;
  dr: number;
  industry: string;
  relevancy: string;
  score: number;
};

export default function Results() {
  const router = useRouter();
  const { targetDomain, targetIndustry, results } = router.query as {
    targetDomain: string;
    targetIndustry: string;
    results: string;
  };
  const parsedResults: Result[] = results ? JSON.parse(results) : [];
  const [contacts, setContacts] = useState<
    { domain: string; contact_email: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const downloadCSV = () => {
    const data = parsedResults.map((result) => {
      const contact = contacts.find((c) => c.domain === result.domain);
      return {
        ...result,
        contact_email: contact ? contact.contact_email : "Not fetched",
      };
    });
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "domain_analysis_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const findContacts = async () => {
    setLoading(true);
    try {
      const domains = parsedResults.map((result) => result.domain);
      const response = await axios.post("http://localhost:5000/find-contacts", {
        domains,
      });
      setContacts(response.data.contacts);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Analysis Results</h1>
        <p className="mb-4">
          Target: {targetDomain} ({targetIndustry})
        </p>
        {parsedResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Domain</th>
                  <th className="border p-2">Traffic</th>
                  <th className="border p-2">DR</th>
                  <th className="border p-2">Industry</th>
                  <th className="border p-2">Relevancy</th>
                  <th className="border p-2">Score</th>
                  <th className="border p-2">Contact Email</th>
                </tr>
              </thead>
              <tbody>
                {parsedResults.map((result, index) => {
                  const contact = contacts.find(
                    (c) => c.domain === result.domain
                  );
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-2">{result.domain}</td>
                      <td className="border p-2">
                        {result.traffic > 0
                          ? result.traffic.toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="border p-2">{result.dr}</td>
                      <td className="border p-2">{result.industry}</td>
                      <td className="border p-2">{result.relevancy}</td>
                      <td className="border p-2">{result.score}</td>
                      <td className="border p-2">
                        {contact ? contact.contact_email : "Not fetched"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No results to display.</p>
        )}
        <button
          onClick={downloadCSV}
          className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Download CSV
        </button>
        <button
          onClick={findContacts}
          disabled={loading}
          className="mt-4 ml-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? "Fetching Contacts..." : "Find Marketing Contacts"}
        </button>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-500 hover:underline"
        >
          Start Over
        </Link>
      </div>
    </div>
  );
}
