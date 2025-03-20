// import { useState } from "react";
// import { useRouter } from "next/router";

// const industries = [
//   "Technology",
//   "Marketing",
//   "Health",
//   "Finance",
//   "E-commerce",
//   "Education",
//   "Entertainment",
//   "Other",
// ];

// export default function Home() {
//   const [targetDomain, setTargetDomain] = useState("");
//   const [targetIndustry, setTargetIndustry] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!targetDomain || !targetIndustry) {
//       setError("Please provide a domain and select an industry.");
//       return;
//     }
//     if (!industries.includes(targetIndustry)) {
//       setError("Invalid industry selected.");
//       return;
//     }
//     router.push({
//       pathname: "/upload",
//       query: { targetDomain, targetIndustry },
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center text-black">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-4">Step 1: Set Target Domain</h1>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="targetDomain" className="block text-gray-700">
//               Target Domain
//             </label>
//             <input
//               type="text"
//               id="targetDomain"
//               value={targetDomain}
//               onChange={(e) => setTargetDomain(e.target.value)}
//               placeholder="e.g., mydomain.com"
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="targetIndustry" className="block text-gray-700">
//               Industry
//             </label>
//             <select
//               id="targetIndustry"
//               value={targetIndustry}
//               onChange={(e) => setTargetIndustry(e.target.value)}
//               className="w-full p-2 border rounded"
//               required
//             >
//               <option value="">Select an industry</option>
//               {industries.map((industry) => (
//                 <option key={industry} value={industry}>
//                   {industry}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//           >
//             Next
//           </button>
//         </form>
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
  industry: string;
  relevancy: string;
  score: number;
}

export default function Dashboard() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [targetDomain, setTargetDomain] = useState<string>("");
  const [targetIndustry, setTargetIndustry] = useState<string>("");
  const [csvFile, setCsvFile] = useState<File | null>(null);

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
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-blue-900 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Navigation</h2>
        <ul>
          <li className="py-2 hover:bg-blue-800 cursor-pointer">
            Verified sites
          </li>
          <li className="py-2 hover:bg-blue-800 cursor-pointer">All sites</li>
          <li className="py-2 hover:bg-blue-800 cursor-pointer">
            Favorite publishers
          </li>
          <li className="py-2 hover:bg-blue-800 cursor-pointer">My projects</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* Form for Analysis */}
        <form onSubmit={handleSubmit} className="mb-6">
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
            <label className="block text-gray-700">Upload CSV</label>
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
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Analyze
          </button>
        </form>

        {/* Loading or Results */}
        {loading ? (
          <div className="flex items-center justify-center">Loading...</div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Results: {sites.length} sites
            </h2>
            {sites.map((site) => (
              <SiteCard key={site.domain} site={site} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function SiteCard({ site }: { site: Site }) {
  useEffect(() => {
    const ctx = document.getElementById(
      `traffic-chart-${site.domain}`
    ) as HTMLCanvasElement | null;
    if (ctx) {
      const chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: site.traffic_history.map((h) => h.date),
          datasets: [
            {
              label: "Organic Traffic",
              data: site.traffic_history.map((h) => h.organic),
              borderColor: "blue",
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
      return () => chart.destroy();
    }
  }, [site]);

  return (
    <div className="border p-4 rounded shadow bg-white">
      <h2 className="text-xl font-semibold mb-2">{site.domain}</h2>
      <p>
        <strong>DR:</strong> {site.dr}
      </p>
      <p>
        <strong>URL Rating:</strong> {site.url_rating}
      </p>
      <p>
        <strong>Backlinks:</strong> {site.backlinks.toLocaleString()}
      </p>
      <p>
        <strong>Ref Domains:</strong> {site.refdomains.toLocaleString()}
      </p>
      <p>
        <strong>Dofollow Backlinks:</strong> {site.dofollow_backlinks}%
      </p>
      <p>
        <strong>Dofollow Ref Domains:</strong> {site.dofollow_refdomains}%
      </p>
      <p>
        <strong>Traffic Monthly Avg:</strong>{" "}
        {site.traffic_monthly_avg.toLocaleString()}
      </p>
      <p>
        <strong>Traffic Cost Monthly Avg:</strong> $
        {site.traffic_cost_monthly_avg.toLocaleString()}
      </p>
      <p>
        <strong>Industry:</strong> {site.industry}
      </p>
      <p>
        <strong>Relevancy:</strong> {site.relevancy}
      </p>
      <p>
        <strong>Score:</strong> {site.score}
      </p>

      {/* Traffic Graph */}
      <div className="my-4">
        <h3 className="font-bold">Traffic (Last 6 Months)</h3>
        <canvas
          id={`traffic-chart-${site.domain}`}
          width="400"
          height="200"
        ></canvas>
      </div>

      {/* Top Pages */}
      <div className="mb-4">
        <h3 className="font-bold">Top Pages</h3>
        <ul className="list-disc pl-5">
          {site.top_pages.map((page, idx) => (
            <li key={idx}>
              {page.url} - {page.traffic.toLocaleString()} visits (
              {(page.share * 100).toFixed(2)}%)
            </li>
          ))}
        </ul>
      </div>

      {/* Top Countries */}
      <div className="mb-4">
        <h3 className="font-bold">Top Countries</h3>
        <ul className="list-disc pl-5">
          {site.top_countries.map((country, idx) => (
            <li key={idx}>
              {country.country.toUpperCase()} -{" "}
              {(country.share * 100).toFixed(2)}%
            </li>
          ))}
        </ul>
      </div>

      {/* Top Keywords */}
      <div>
        <h3 className="font-bold">Top Keywords</h3>
        <ul className="list-disc pl-5">
          {site.top_keywords.map((keyword, idx) => (
            <li key={idx}>
              {keyword.keyword} (Pos: {keyword.position}) -{" "}
              {keyword.traffic.toLocaleString()} visits
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
