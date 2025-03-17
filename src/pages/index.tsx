import { useState } from "react";
import { useRouter } from "next/router";

const industries = [
  "Technology",
  "Marketing",
  "Health",
  "Finance",
  "E-commerce",
  "Education",
  "Entertainment",
  "Other",
];

export default function Home() {
  const [targetDomain, setTargetDomain] = useState("");
  const [targetIndustry, setTargetIndustry] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDomain || !targetIndustry) {
      setError("Please provide a domain and select an industry.");
      return;
    }
    if (!industries.includes(targetIndustry)) {
      setError("Invalid industry selected.");
      return;
    }
    router.push({
      pathname: "/upload",
      query: { targetDomain, targetIndustry },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Step 1: Set Target Domain</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="targetDomain" className="block text-gray-700">
              Target Domain
            </label>
            <input
              type="text"
              id="targetDomain"
              value={targetDomain}
              onChange={(e) => setTargetDomain(e.target.value)}
              placeholder="e.g., mydomain.com"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="targetIndustry" className="block text-gray-700">
              Industry
            </label>
            <select
              id="targetIndustry"
              value={targetIndustry}
              onChange={(e) => setTargetIndustry(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select an industry</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
