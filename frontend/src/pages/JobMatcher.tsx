import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PostJob = () => {
  const [formData, setFormData] = useState({
    keywords: "",
    location: "",
    max_jobs: "",
    timeRange: "", // default to no time range
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler specifically for the Select component
  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, timeRange: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/search_jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/GetJobs");
      } else {
        console.error("Failed to submit form");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[500px] my-[50px] mx-auto p-[30px] rounded-[10px] backdrop-blur-xl bg-black/40 border border-white/10 shadow-[0_4px_8px_rgba(0,0,0,0.1)] font-['Arial',sans-serif] max-[600px]:p-5 font-extrabold"
    >
      <h2 className="text-center mb-5 text-white text-3xl">Search a Job</h2>
      <div>
        <label
          htmlFor="keywords"
          className="font-bold block mb-2 text-[#D1D5DB]"
        >
          Keywords:
        </label>
        <input
          type="text"
          id="keywords"
          name="keywords"
          value={formData.keywords}
          onChange={handleChange}
          required
          className="w-full p-3 border border-[#007bff] my-[15px] rounded-[6px] text-white bg-transparent transition-[border-color] duration-300 ease-[ease] focus:border-white focus:outline-none focus:shadow-[0_0_5px_rgba(0,123,255,0.5)] max-[600px]:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="location"
          className="font-bold block mb-2 text-[#D1D5DB]"
        >
          Location:
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full p-3 my-[15px] border border-[#007bff] rounded-[6px] text-white bg-transparent transition-[border-color] duration-300 ease-[ease] focus:border-white focus:outline-none focus:shadow-[0_0_5px_rgba(0,123,255,0.5)] max-[600px]:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="max_jobs"
          className="font-bold block mb-2 text-[#D1D5DB]"
        >
          Max Jobs:
        </label>
        <input
          type="number"
          id="max_jobs"
          name="max_jobs"
          value={formData.max_jobs}
          onChange={handleChange}
          required
          className="w-full p-3 my-[15px] border border-[#007bff] rounded-[6px] text-base bg-transparent transition-[border-color] duration-300 ease-[ease] focus:border-white focus:outline-none focus:shadow-[0_0_5px_rgba(0,123,255,0.5)] max-[600px]:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="timeRange"
          className="font-bold block mb-2 text-[#D1D5DB]"
        >
          Time Range:
        </label>
        <Select value={formData.timeRange} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-full border border-[#007bff] my-[15px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3600">1 hour</SelectItem>
            <SelectItem value="86400">24 hours</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="has-[button:disabled]:cursor-not-allowed mt-10">
        <Button
          type="submit"
          className="w-full"
          variant="outline"
          disabled={
            !formData.keywords ||
            !formData.location ||
            !formData.max_jobs ||
            !formData.timeRange ||
            isLoading
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
};

export default PostJob;
