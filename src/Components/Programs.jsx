import { Card, CardContent } from "../Components/ui/Card";
const programs = {
  ScienceEngineering: {
    icon: "🧪",
    iconColor: "text-blue-600",
    title: "Science & Engineering",
    description: "Cutting-edge research facilities and world-renowned faculty in STEM fields.",
    items: ["Computer Science", "Biomedical Engineering", "Environmental Science", "Data Analytics"],
    link: "#"
  },
  BusinessEconomics: {
    icon: "💼",
    iconColor: "text-yellow-600",
    title: "Business & Economics",
    description: "Industry-leading business programs with global perspectives and practical experience.",
    items: ["MBA Programs", "International Business", "Finance & Banking", "Entrepreneurship"],
    link: "#"
  },
  ArtsHumanities: {
    icon: "🎨",
    iconColor: "text-pink-500",
    title: "Arts & Humanities",
    description: "Explore creativity and critical thinking through diverse cultural and artistic studies.",
    items: ["Literature", "History", "Philosophy", "Visual Arts"],
    link: "#"
  },
  EnvironmentalLifeSciences: {
    icon: "🌿",
    iconColor: "text-green-600",
    title: "Environmental & Life Sciences",
    description: "Programs focused on sustainability, ecology, and life sciences research.",
    items: ["Ecology", "Marine Biology", "Sustainability Studies", "Genetics"],
    link: "#"
  },
  LawSocialSciences: {
    icon: "⚖️",
    iconColor: "text-purple-600",
    title: "Law & Social Sciences",
    description: "Comprehensive programs preparing students for careers in law, governance, and society.",
    items: ["Law", "Political Science", "Sociology", "Public Policy"],
    link: "#"
  },
  InformationTechnologyAI: {
    icon: "🖥️",
    iconColor: "text-indigo-600",
    title: "Information Technology & AI",
    description: "Advanced IT programs and artificial intelligence research for the future of technology.",
    items: ["Artificial Intelligence", "Cybersecurity", "Cloud Computing", "Software Engineering"],
    link: "#"
  },
  HealthMedicine: {
    icon: "🏥",
    iconColor: "text-red-600",
    title: "Health & Medicine",
    description: "Leading programs in medical sciences, healthcare, and public health.",
    items: ["Medicine", "Nursing", "Public Health", "Pharmacy"],
    link: "#"
  },
  HospitalityTourism: {
    icon: "✈️",
    iconColor: "text-teal-500",
    title: "Hospitality & Tourism",
    description: "Prepare for global careers in hospitality, travel, and tourism management.",
    items: ["Hotel Management", "Tourism Studies", "Event Management", "Travel Operations"],
    link: "#"
  }
};
function Program() {
  return (
    <section className="py-20 my-4 glass text-gray-700">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            World-Class Academic Programs
          </h2>
          <p className="text-xl mb-8 text-pretty leading-relaxed max-w-4xl mx-auto">
            Discover our comprehensive range of undergraduate, graduate, and doctoral
            programs designed to prepare you for success in the global marketplace.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(programs).map((program, index) => (
            <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-left">
                <div className={`text-4xl m-4 ${program.iconColor}`}>{program.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-primary">{program.title}</h3>
                <p className="text-muted-foreground mb-3">{program.description}</p>
                <ul className="mb-4 list-disc list-inside text-muted-foreground">
                  {program.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <a href={program.link} className="text-blue-500 font-medium hover:underline">
                  Learn More →
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Program;