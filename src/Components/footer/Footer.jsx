import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

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

function FooterLinkGroup({ title, links }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h4 className="text-sm font-bold mb-4 uppercase text-gray-700 tracking-wider">
        {title}
      </h4>

      <ul className="space-y-3 text-sm">
        {links.map((link, index) => (
          <motion.li
            key={link.label}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.a
              whileHover={{ x: 5, scale: 1.05 }}
              href={link.href}
              className="text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text transition-all duration-300 font-medium inline-block"
            >
              {link.label}
            </motion.a>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}


function Socials() {
  return (
    <div className="flex space-x-3 mt-4">
      {socialMedia.map(({ Icon, href, label }, index) => (
        <motion.a
          key={label}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0], y: -5 }}
          whileTap={{ scale: 0.9 }}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Link to our ${label} page`}
          className="backdrop-blur-xl bg-white/60 p-2.5 rounded-full border border-white/60 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
        >
          <Icon className="w-5 h-5" />
        </motion.a>
      ))}
    </div>
  );
}


export function Footer() {
  return (
    <footer className="relative">
      <div className="mx-auto py-12 px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-8">
          {/* Brand & Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-1 sm:col-span-2 md:col-span-2"
          >
            <motion.h3
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold uppercase mb-4 tracking-wider bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              NovaTech University
            </motion.h3>
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="backdrop-blur-xl bg-white/40 p-4 rounded-2xl border border-white/60 mb-4"
            >
              <p className="text-sm leading-relaxed text-gray-700 font-medium">
                Empowering minds and shaping the future through innovative education and
                groundbreaking research.
              </p>
            </motion.div>
            <Socials />
          </motion.div>

          {/* Quick Links & Resources */}
          <FooterLinkGroup title="Quick Links" links={quickLinks} />
          <FooterLinkGroup title="Resources" links={resources} />

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-sm font-bold mb-4 uppercase text-gray-700 tracking-wider">
              Contact Us
            </h4>
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="backdrop-blur-xl bg-white/40 p-4 rounded-2xl border border-white/60"
            >
              <div className="text-sm font-medium space-y-2 text-gray-700">
                <p>123 University Avenue</p>
                <p>Excellence City, EC 12345</p>
                <p className="pt-2">
                  <motion.a
                    whileHover={{ scale: 1.05, x: 5 }}
                    href="tel:5551234567"
                    className="hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text transition-all duration-300 inline-block"
                  >
                    Phone: (555) 123-4567
                  </motion.a>
                </p>
                <p>
                  <motion.a
                    whileHover={{ scale: 1.05, x: 5 }}
                    href="mailto:info@excellence.edu"
                    className="hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text transition-all duration-300 inline-block"
                  >
                    Email: info@excellence.edu
                  </motion.a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="border-t-2 border-white/40 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-600 font-medium">
            &copy; {new Date().getFullYear()} NovaTech University. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}