import React from "react";
import { Card, CardContent } from "../Components/ui/Card";
import { Link } from "react-router-dom";

export const programs = {
  AiResearcher: {
    icon: "🤖",
    iconColor: "text-teal-500",
    title: "AI Researcher",
    description: "Explore the forefront of artificial intelligence and machine learning.",
    items: ["Machine Learning", "Natural Language Processing", "Computer Vision", "Robotics"],
  },
  BusinessEconomics: {
    icon: "💼",
    iconColor: "text-yellow-600",
    title: "Business & Economics",
    description: "Industry-leading business programs with global perspectives and practical experience.",
    items: ["MBA Programs", "International Business", "Finance & Banking", "Entrepreneurship"],
  },
  ArtsHumanities: {
    icon: "🎨",
    iconColor: "text-pink-500",
    title: "Arts & Humanities",
    description: "Explore creativity and critical thinking through diverse cultural and artistic studies.",
    items: ["Literature", "History", "Philosophy", "Visual Arts"],
  },
  EnvironmentalLifeSciences: {
    icon: "🌿",
    iconColor: "text-green-600",
    title: "Environmental & Life Sciences",
    description: "Programs focused on sustainability, ecology, and life sciences research.",
    items: ["Ecology", "Marine Biology", "Sustainability Studies", "Genetics"],
  },
  LawSocialSciences: {
    icon: "⚖️",
    iconColor: "text-purple-600",
    title: "Law & Social Sciences",
    description: "Comprehensive programs preparing students for careers in law, governance, and society.",
    items: ["Law", "Political Science", "Sociology", "Public Policy"],
  },
  InformationTechnologyAI: {
    icon: "🖥️",
    iconColor: "text-indigo-600",
    title: "Information Technology & AI",
    description: "Advanced IT programs and artificial intelligence research for the future of technology.",
    items: ["Artificial Intelligence", "Cybersecurity", "Cloud Computing", "Software Engineering"],
  },
  HealthMedicine: {
    icon: "🏥",
    iconColor: "text-red-600",
    title: "Health & Medicine",
    description: "Leading programs in medical sciences, healthcare, and public health.",
    items: ["Medicine", "Nursing", "Public Health", "Pharmacy"],
  },
  HospitalityTourism: {
    icon: "✈️",
    iconColor: "text-teal-500",
    title: "Hospitality & Tourism",
    description: "Prepare for global careers in hospitality, travel, and tourism management.",
    items: ["Hotel Management", "Tourism Studies", "Event Management", "Travel Operations"],
  },
  ScienceEngineering: {
    icon: "🧪",
    iconColor: "text-blue-600",
    title: "Science & Engineering",
    description: "Cutting-edge research facilities and world-renowned faculty in STEM fields.",
    items: ["Computer Science", "Biomedical Engineering", "Environmental Science", "Data Analytics"],
  }
};

const Curriculum = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-teal-500 text-white mt-5 rounded-lg">
        <div className="container mx-auto px-6 py-10 flex flex-col-reverse md:flex-row items-center md:justify-between">
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
              Unlock Your Potential with Our Programs
            </h1>
            <p className="sm:text-xl text-xs mb-6 leading-relaxed">
              Dive into world-class education and research opportunities designed to equip you with skills for tomorrow’s careers.
            </p>
            <Link
              to="/curriculum"
              className="inline-block bg-white text-blue-600 px-6 py-2 sm:text-sm text-xs rounded-lg shadow-lg hover:bg-gray-100 transition-all"
            >
              Explore Programs
            </Link>
          </div>
          <div className="md:w-1/2 mb-10 md:mb-0 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"
              alt="Education Hero"
              className="w-full max-w-md rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>
      <section className="py-20 my-4 glass text-gray-700">
        <div className=" mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="lg:text-3xl sm:text-2xl text-xl md:text-5xl font-bold mb-6 text-balance">
              World-Class Academic Programs
            </h2>
            <p className="lg:text-xl sm:text-sm text-xs mb-8 text-pretty leading-relaxed max-w-4xl mx-auto">
              Discover our comprehensive range of undergraduate, graduate, and doctoral
              programs designed to prepare you for success in the global marketplace.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(programs).map(([key, program]) => (
              <Card key={key} className="bg-white shadow-sm border-border hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-left">
                  <div className={`lg:text-5xl sm:text-3xl text-xl m-4 ${program.iconColor}`}>{program.icon}</div>
                  <h3 className="sm:text-xl text-sm font-semibold mb-3 text-primary">{program.title}</h3>
                  <p className="text-muted-foreground lg:text-xl sm:text-sm text-xs mb-3">{program.description}</p>
                  <ul className="mb-4 list-disc list-inside lg:text-xl sm:text-sm text-xs">
                    {program.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  {/* link to param-based detail route */}
                  <Link
                    to={`/curriculum/${encodeURIComponent(key)}`}
                    className="text-blue-500 font-medium lg:text-xl sm:text-sm text-xs hover:underline"
                  >
                    Learn More →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Curriculum;
