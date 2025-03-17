import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const { targetDomain, targetIndustry } = router.query as {
    targetDomain: string;
    targetIndustry: string;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("target_domain", targetDomain);
    formData.append("target_industry", targetIndustry);
    formData.append("csv_file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      router.push({
        pathname: "/results",
        query: {
          targetDomain,
          targetIndustry,
          results: JSON.stringify(response.data.results),
        },
      });
    } catch (err) {
      setError("Failed to process domains. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Step 2: Upload Domain List</h1>
        <p className="mb-4">
          Target: {targetDomain} ({targetIndustry})
        </p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="csv_file" className="block text-gray-700">
              Upload CSV (one domain per line)
            </label>
            <input
              type="file"
              id="csv_file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Analyze
          </button>
        </form>
      </div>
    </div>
  );
}
