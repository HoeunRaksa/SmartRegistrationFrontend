import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Clock, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Admissions", href: "/registration" },
  { label: "Academic Programs", href: "/curriculum" },
  { label: "About Us", href: "/aboutus" },
  { label: "Campus Life", href: "/aboutus" },
];

const academicLinks = [
  { label: "Undergraduate Programs", href: "/curriculum" },
  { label: "Graduate Studies", href: "/curriculum" },
  { label: "Online Learning", href: "/curriculum" },
  { label: "Research Opportunities", href: "/aboutus" },
  { label: "Academic Calendar", href: "/curriculum" },
];

const resources = [
  { label: "Library Services", href: "/aboutus" },
  { label: "Student Portal", href: "/login" },
  { label: "Career Center", href: "/aboutus" },
  { label: "Alumni Network", href: "/aboutus" },
  { label: "IT Help Desk", href: "/aboutus" },
];

const studentServices = [
  { label: "Registration", href: "/registration" },
  { label: "Financial Aid", href: "/aboutus" },
  { label: "Housing", href: "/aboutus" },
  { label: "Health Services", href: "/aboutus" },
  { label: "Counseling", href: "/aboutus" },
];

const socialMedia = [
  { Icon: Facebook, href: "https://facebook.com/novatech", label: "Facebook" },
  { Icon: Twitter, href: "https://twitter.com/novatech", label: "Twitter" },
  { Icon: Instagram, href: "https://instagram.com/novatech", label: "Instagram" },
  { Icon: Linkedin, href: "https://linkedin.com/school/novatech", label: "LinkedIn" },
  { Icon: Youtube, href: "https://youtube.com/novatech", label: "YouTube" },
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
          className="backdrop-blur-xl bg-white/60 p-2.5 rounded-full border border-white/60 gen-z-glass text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
        >
          <Icon className="w-5 h-5" />
        </motion.a>
      ))}
    </div>
  );
}


export function Footer() {
  return (
    <footer className="relative backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/40 border-t-2 border-white/40 gen-z-perspective" style={{ transformStyle: 'preserve-3d' }}>
      {/* Main Footer Content */}
      <div className="mx-auto py-16 px-6 lg:px-10 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-y-10 gap-x-8">
          {/* Brand & Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-1 sm:col-span-2 lg:col-span-2"
          >
            <motion.h3
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-bold uppercase mb-4 tracking-wider bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              NovaTech University
            </motion.h3>
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="backdrop-blur-xl bg-white/50 p-5 rounded-2xl border border-white/60 gen-z-card mb-6"
            >
              <p className="text-sm leading-relaxed text-gray-700 font-medium mb-3">
                Empowering minds and shaping the future through innovative education,
                groundbreaking research, and global collaboration since 1892.
              </p>
              <p className="text-xs text-gray-600">
                Accredited by the Higher Learning Commission
              </p>
            </motion.div>
            <Socials />

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              <h4 className="text-sm font-bold mb-3 text-gray-700">Stay Connected</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-xl text-sm backdrop-blur-xl bg-white/60 border border-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <FooterLinkGroup title="Quick Links" links={quickLinks} />

          {/* Academic */}
          <FooterLinkGroup title="Academics" links={academicLinks} />

          {/* Student Services */}
          <FooterLinkGroup title="Student Services" links={studentServices} />

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
              className="backdrop-blur-xl bg-white/50 p-5 rounded-2xl border border-white/60 gen-z-card"
            >
              <div className="text-sm font-medium space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <div>
                    <p>123 University Avenue</p>
                    <p>Excellence City, EC 12345</p>
                    <p>United States</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-purple-600 shrink-0" />
                  <motion.a
                    whileHover={{ x: 3 }}
                    href="tel:5551234567"
                    className="hover:text-purple-600 transition-colors"
                  >
                    +1 (555) 123-4567
                  </motion.a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                  <motion.a
                    whileHover={{ x: 3 }}
                    href="mailto:info@novatech.edu"
                    className="hover:text-purple-600 transition-colors"
                  >
                    info@novatech.edu
                  </motion.a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Mon-Fri: 8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-purple-600 shrink-0" />
                  <motion.a
                    whileHover={{ x: 3 }}
                    href="https://novatech.edu"
                    className="hover:text-purple-600 transition-colors"
                  >
                    www.novatech.edu
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 backdrop-blur-xl bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90 rounded-2xl p-6 border border-white/30 gen-z-card gen-z-glow-purple"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div>
              <p className="text-2xl font-bold">500K+</p>
              <p className="text-sm opacity-80">Alumni Worldwide</p>
            </div>
            <div>
              <p className="text-2xl font-bold">200+</p>
              <p className="text-sm opacity-80">Academic Programs</p>
            </div>
            <div>
              <p className="text-2xl font-bold">50+</p>
              <p className="text-sm opacity-80">Global Partners</p>
            </div>
            <div>
              <p className="text-2xl font-bold">95%</p>
              <p className="text-sm opacity-80">Employment Rate</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t-2 border-white/40 backdrop-blur-xl bg-white/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 font-medium text-center md:text-left">
              &copy; {new Date().getFullYear()} NovaTech University. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <motion.a whileHover={{ y: -2 }} href="/privacy" className="hover:text-purple-600 transition-colors">
                Privacy Policy
              </motion.a>
              <motion.a whileHover={{ y: -2 }} href="/terms" className="hover:text-purple-600 transition-colors">
                Terms of Service
              </motion.a>
              <motion.a whileHover={{ y: -2 }} href="/accessibility" className="hover:text-purple-600 transition-colors">
                Accessibility
              </motion.a>
              <motion.a whileHover={{ y: -2 }} href="/sitemap" className="hover:text-purple-600 transition-colors">
                Sitemap
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}