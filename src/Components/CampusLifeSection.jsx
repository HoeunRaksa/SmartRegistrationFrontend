import { Users, Dumbbell, Home, Globe } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/Card.jsx";
import { ApiBaseImg } from "../Configration";
export default function CampusLife() {
  const features = [
    {
      icon: <Users className="w-5 h-5 text-white" />,
      title: "500+ Student Organizations",
      desc: "Join clubs, societies, and groups that match your interests and passions.",
    },
    {
      icon: <Dumbbell className="w-5 h-5 text-white" />,
      title: "World-Class Athletics",
      desc: "Compete at the highest level or enjoy recreational sports and fitness facilities.",
    },
    {
      icon: <Home className="w-5 h-5 text-white" />,
      title: "Modern Housing",
      desc: "Live in state-of-the-art residence halls with modern amenities and community spaces.",
    },
    {
      icon: <Globe className="w-5 h-5 text-white" />,
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
    <section className="glass rounded-3xl text-white sm:py-16 my-4 px-6 lg:px-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="lg:text-6xl py-10 sm:text-2xl text-3xl text-orange-600 font-bold mb-4">Vibrant Campus Life</h2>
        <p className="text-lg">
          Experience a dynamic campus community with endless opportunities for growth,
          connection, and discovery beyond the classroom.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-4 gap-8 mb-16">
        {features.map((item, index) => (
          <Card key={index} className="glass text-white transition-all duration-200">
            <CardHeader className="flex flex-col items-center text-center">
              <div className="bg-blue-600 p-4 rounded-full mb-4">{item.icon}</div>
              <CardTitle className="my-2 sm:text-xl text-orange-600 ">{item.title}</CardTitle>
              <CardDescription className="md:text-lg my-6 sm:text-sm  opacity-80">{item.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

   {/* Highlights */}
<div className="grid md:grid-cols-3 gap-6">
  {highlights.map((highlight) => (
    <div
      key={highlight.label}
      className="relative  overflow-hidden rounded-[10px]"
    >
      <img
        src={`${ApiBaseImg}${highlight.img}`}
        alt={highlight.label}
        className="w-full h-56 object-cover "
      />
      <div className="absolute bottom-2 left-2 bg-white px-3 py-1 rounded-sm text-sm text-orange-600">
        {highlight.label}
      </div>
    </div>
  ))}
</div>

    </section>
  );
}
