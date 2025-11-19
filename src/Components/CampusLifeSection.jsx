import { Users, Dumbbell, Home, Globe } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/Card.jsx";
import { ApiBaseImg } from "../Configration";
export default function CampusLife() {
  const features = [
    {
      icon: <Users className="w-5 h-5 text-gray-700" />,
      title: "500+ Student Organizations",
      desc: "Join clubs, societies, and groups that match your interests and passions.",
    },
    {
      icon: <Dumbbell className="w-5 h-5 text-gray-700" />,
      title: "World-Class Athletics",
      desc: "Compete at the highest level or enjoy recreational sports and fitness facilities.",
    },
    {
      icon: <Home className="w-5 h-5 text-gray-700" />,
      title: "Modern Housing",
      desc: "Live in state-of-the-art residence halls with modern amenities and community spaces.",
    },
    {
      icon: <Globe className="w-5 h-5 text-gray-700" />,
      title: "Global Programs",
      desc: "Study abroad in 50+ countries and gain international experience.",
    },
  ];

  const highlights = [
    { img: "ScholasticAwards.jpg", label: "Academic Excellence" },
    { img: "active.jpg", label: "Active Lifestyle" },
    { img: "Essay.jpg", label: "Cultural Diversity" },
  ];

  return (
    <section className="glass rounded-lg text-gray-600 py-16 my-4 px-6 lg:px-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="lg:text-3xl sm:text-2xl text-xl text-gray-700 font-bold mb-4">Vibrant Campus Life</h2>
        <p className="lg:text-xl sm:text-sm text-xs">
          Experience a dynamic campus community with endless opportunities for growth,
          connection, and discovery beyond the classroom.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-4 gap-8 mb-16">
        {features.map((item, index) => (
          <Card key={index} className="glass text-gray-600 transition-all duration-200">
            <CardHeader className="flex flex-col items-center text-center">
              <div className="itemglass p-2 rounded-full mb-4">{item.icon}</div>
              <CardTitle className="mb-2 sm:text-xl text-gray-700 text-xs">{item.title}</CardTitle>
              <CardDescription className="md:text-lg sm:text-sm text-xs opacity-80">{item.desc}</CardDescription>
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
      <div className="absolute bottom-2 left-2 glass px-3 py-1 rounded-lg text-sm text-gray-700">
        {highlight.label}
      </div>
    </div>
  ))}
</div>

    </section>
  );
}
