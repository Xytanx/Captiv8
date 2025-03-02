'use client'
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DeleteButton({ filename }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await axios.delete('/api/delete?filename=' + filename);
      router.push("/"); // Redirect to main page after deletion
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="bg-red-600 hover:bg-red-700 transition-all duration-200 ease-in-out text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-105"
    >
      Delete File
    </button>
  );
}
