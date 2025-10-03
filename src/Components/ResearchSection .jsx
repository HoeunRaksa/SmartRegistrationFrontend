import React from "react";
import { ApiBaseImg } from "../Configration";

const researchData = {
  stats: [
    { value: "$2.5B", label: "Research Funding" },
    { value: "1,200+", label: "Active Projects" },
    { value: "85", label: "Research Centers" },
    { value: "15,000+", label: "Publications" }
  ],
  focusAreas: [
    "Quantum Computing & Advanced Materials",
    "Biotechnology & Genetic Engineering",
    "Sustainable Energy & Climate Science",
    "Artificial Intelligence & Machine Learning"
  ],
  image: "academic-achievement-award-ceremony.jpg",
  imageBadge: "Nobel Prize Winners: 12"
};

const ResearchSection = () => {
  return (
    <section className="py-20 my-6 glass rounded text-gray-700">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row lg:items-stretch items-start gap-12">
        {/* Left Content */}
        <div className="lg:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-700">
            Leading Research & Innovation
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            At U-World, we're at the forefront of groundbreaking research that addresses global challenges and shapes the future of humanity.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {researchData.stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/50 backdrop-blur-md p-6 rounded-xl text-center shadow hover:shadow-lg transition-shadow duration-300"
              >
                <p className="text-2xl font-bold text-gray-700">{stat.value}</p>
                <p className="text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Research Focus Areas */}
          <div>
            <h3 className="font-semibold mb-4 text-xl text-gray-700">Research Focus Areas</h3>
            <ul className="space-y-3">
              {researchData.focusAreas.map((area, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0"></span>
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/3 relative w-full flex justify-center items-center">
          <img
            src={`${ApiBaseImg}${researchData.image}`}
            alt="Research Lab"
            className="rounded-2xl shadow-lg w-full object-cover"
          />
          {/* Badge */}
          <div className="absolute top-18 right-10 glass text-gray-700 px-4 py-1 rounded-full 
           text-sm font-medium flex items-center gap-2">
            {researchData.imageBadge}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
