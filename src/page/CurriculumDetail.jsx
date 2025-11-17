// import React from "react";

// const CurriculumDetail = () => {
//   return <div className="p-10">
//     Curriculum Detail Page
//   </div>;
// };

// export default CurriculumDetail;
// src/pages/CurriculumDetail.jsx
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { programs } from "./Curriculum";

const CurriculumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // id is the key name in the `programs` object
  const program = programs[id];

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Program Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the program you're looking for.</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-slate-100 rounded-md">Go Back</button>
            <Link to="/" className="px-4 py-2 bg-sky-600 text-white rounded-md">Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`text-4xl ${program.iconColor}`}>{program.icon}</div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{program.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">Program overview</p>
                  </div>
                </div>

                <div className="space-x-2">
                  <button onClick={() => navigate(-1)} className="text-sky-600 hover:underline">← Back</button>
                  <Link to="/" className="hidden md:inline-block text-sm px-3 py-1 border rounded-md">All Programs</Link>
                </div>
              </div>

              <p className="mt-6 text-gray-700">{program.description}</p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <section className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold">What you'll study</h3>
                  <ul className="mt-3 list-disc pl-5 text-gray-700 space-y-1">
                    {program.items.map((it, idx) => <li key={idx}>{it}</li>)}
                  </ul>
                </section>

                <section className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold">Career paths</h3>
                  <p className="mt-2 text-gray-700">
                    Typical careers include research, industry roles, consulting, and more depending on the program.
                  </p>
                </section>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href="#apply" className="inline-block bg-sky-600 text-white px-4 py-2 rounded-md">Apply</a>
                <a href="#curriculum" className="inline-block border border-slate-200 px-4 py-2 rounded-md">View Curriculum</a>
              </div>
            </div>

            {/* FAQ / admission */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">Admission requirements</h4>
                <p className="text-gray-700">High school diploma, transcripts, and any program-specific requirements.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">Frequently asked questions</h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Is financial aid available? — Yes, scholarships and aid options are available.</li>
                  <li>Can I combine majors? — In many cases, yes through double majors or minors.</li>
                </ul>
              </div>
            </div>
          </main>

          {/* Sticky aside */}
          <aside className="w-full lg:w-80">
            <div className="sticky top-6">
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <div className="h-44 w-full bg-slate-100 rounded-md flex items-center justify-center text-4xl">
                  {program.icon}
                </div>

                <div className="mt-4 text-sm text-gray-700">
                  <p><strong>Program length:</strong> 3–4 years</p>
                  <p className="mt-1"><strong>Degree:</strong> Bachelor / Master</p>
                </div>

                <div className="mt-4">
                  <a href="#contact" className="block text-center bg-sky-50 text-sky-700 border border-sky-100 px-3 py-2 rounded-md">Contact an advisor</a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CurriculumDetail;