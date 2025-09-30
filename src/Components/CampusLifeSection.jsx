import { Users, Dumbbell, Home, Globe } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/Card.jsx";
import { ApiBaseImg } from "../Configration";
export default function CampusLife() {
  const features = [
    {
      icon: <Users className="w-10 h-10 text-gray-700" />,
      title: "500+ Student Organizations",
      desc: "Join clubs, societies, and groups that match your interests and passions.",
    },
    {
      icon: <Dumbbell className="w-10 h-10 text-gray-700" />,
      title: "World-Class Athletics",
      desc: "Compete at the highest level or enjoy recreational sports and fitness facilities.",
    },
    {
      icon: <Home className="w-10 h-10 text-gray-700" />,
      title: "Modern Housing",
      desc: "Live in state-of-the-art residence halls with modern amenities and community spaces.",
    },
    {
      icon: <Globe className="w-10 h-10 text-gray-700" />,
      title: "Global Programs",
      desc: "Study abroad in 50+ countries and gain international experience.",
    },
  ];

  const highlights = [
    { img: "scientific-research-laboratory.png", label: "Academic Excellence" },
    { img: "scientific-research-laboratory.png", label: "Active Lifestyle" },
    { img: "scientific-research-laboratory.png", label: "Cultural Diversity" },
  ];

  return (
    <section className="glass text-gray-700 py-16 my-4 px-6 lg:px-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">Vibrant Campus Life</h2>
        <p className="text-lg">
          Experience a dynamic campus community with endless opportunities for growth,
          connection, and discovery beyond the classroom.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-4 gap-8 mb-16">
        {features.map((item, index) => (
          <Card key={index} className="glass text-gray-700 transition-all duration-200">
            <CardHeader className="flex flex-col items-center text-center">
              <div className="glass p-4 rounded-full mb-4">{item.icon}</div>
              <CardTitle className="mb-2">{item.title}</CardTitle>
              <CardDescription>{item.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

   {/* Highlights */}
<div className="grid md:grid-cols-3 gap-6">
  {highlights.map((highlight) => (
    <div
      key={highlight.label} // ✅ unique key
      className="relative rounded overflow-hidden glass"
    >
      <img
        src={`${ApiBaseImg}${highlight.img}`}
        alt={highlight.label}
        className="w-full h-56 object-cover"
      />
      <div className="absolute bottom-2 left-2 glass px-3 py-1 rounded text-sm text-gray-700">
        {highlight.label}
      </div>
    </div>
  ))}
</div>

    </section>
  );
}
