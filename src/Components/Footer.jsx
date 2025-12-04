import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

// --- Configuration Data ---
const quickLinks = [
  { label: "Admissions", href: "/admissions" },
  { label: "Academic Programs", href: "/programs" },
  { label: "Research", href: "/research" },
  { label: "Campus Life", href: "/campus-life" },
];

const resources = [
  { label: "Library", href: "/library" },
  { label: "Student Services", href: "/services" },
  { label: "Career Center", href: "/careers" },
  { label: "Alumni Network", href: "/alumni" },
];

const socialMedia = [
  { Icon: Facebook, href: "https://facebook.com/excellence", label: "Facebook" },
  { Icon: Twitter, href: "https://twitter.com/excellence", label: "Twitter" },
  { Icon: Instagram, href: "https://instagram.com/excellence", label: "Instagram" },
  { Icon: Linkedin, href: "https://linkedin.com/school/excellence", label: "LinkedIn" },
];

// --- Sub-Components for Modularity ---

// Reusable link list component
function FooterLinkGroup({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-4 uppercase text-gray-800 tracking-wider">
        {title}
      </h4>
      <ul className="space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-white hover:text-blue-600 transition-colors duration-200 font-sans"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Social media icon component
function Socials() {
  return (
    <div className="flex space-x-4 mt-4">
      {socialMedia.map(({ Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Link to our ${label} page`}
          className="text-gray-800 hover:text-blue-600 transition-colors duration-200"
        >
          <Icon className="w-6 h-6" />
        </a>
      ))}
    </div>
  );
}

// --- Main Component ---
export function Footer() {
  return (
    <footer className="glass rounded-3xl">
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-8">
          {/* Column 1: Brand & Mission */}
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-xl  uppercase mb-4 tracking-wider text-gray-800">
              Excellence University
            </h3>
            <p className="text-sm leading-relaxed text-white max-w-sm font-sans">
              Empowering minds and shaping the future through innovative education and
              groundbreaking research.
            </p>
            <Socials />
          </div>

          {/* Column 2 & 3: Quick Links & Resources (using reusable components) */}
          <FooterLinkGroup title="Quick Links" links={quickLinks} />
          <FooterLinkGroup title="Resources" links={resources} />

          {/* Column 4: Contact Information */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase text-gray-800 tracking-wider">
              Contact Us
            </h4>
            <div className="text-sm  font-sans space-y-2 text-white">
              <p>123 University Avenue</p>
              <p>Excellence City, EC 12345</p>
              <p className="pt-2">
                <a href="tel:5551234567" className="hover:text-blue-600 transition-colors">
                  Phone: (555) 123-4567
                </a>
              </p>
              <p>
                <a href="mailto:info@excellence.edu" className="hover:text-blue-600 transition-colors">
                  Email: info@excellence.edu
                </a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Separator and Copyright */}
        <div className="border-t border- mt-12 pt-8 text-center">
          <p className="text-sm text-white">
            &copy; {new Date().getFullYear()} Excellence University. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}