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
};
function Program() {
  return (
    <section className="py-20 my-4 glass rounded-lg text-gray-700">
      <div className="mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="lg:text-3xl sm:text-2xl text-sm font-bold mb-6 text-balance">
            World-Class Academic Programs
          </h2>
          <p className="lg:text-xl sm:text-sm text-xs mb-8 max-w-4xl mx-auto">
            Discover our comprehensive range of undergraduate, graduate, and doctoral
            programs designed to prepare you for success in the global marketplace.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(programs).map((program, index) => (
            <Card key={index} className=" hover:shadow-lg transition-shadow duration-300 bg-white shadow-sm">
              <CardContent className="p-6 text-left">
                <div className={`sm:text-4xl text-xl m-4 ${program.iconColor}`}>{program.icon}</div>
                <h3 className="sm:text-xl text-sm font-bold pb-2">{program.title}</h3>
                <p className="lg:text-xl sm:text-sm text-xs mb-3">{program.description}</p>
                <ul className="mb-4 list-disc list-inside lg:text-xl sm:text-sm text-xs">
                  {program.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <a href={program.link} className="text-blue-500 lg:text-xl sm:text-sm text-xs hover:underline">
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