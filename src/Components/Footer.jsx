export function Footer() {
  return (
    <footer className="text-gray-600 bg-white py-2 px-4 rounded-lg shadow-md">
        <div className=" mx-auto py-4 px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="sm:text-sm text-xs font-bold mb-4">Excellence University</h3>
              <p className="text-xs opacity-80 leading-relaxed">
                Empowering minds and shaping the future through innovative education and groundbreaking research.
              </p>
            </div>

            <div>
              <h4 className="sm:text-sm text-xs  font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                    Admissions
                  </a>
                </li>
                <li>
                  <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                    Academic Programs
                  </a>
                </li>
                <li>
                  <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                    Research
                  </a>
                </li>
                <li>
                  <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                    Campus Life
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="sm:text-sm text-xs font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                    Library
                  </a>
                </li>
                <li>
                  <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                    Student Services
                  </a>
                </li>
                <li>
                  <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                    Career Center
                  </a>
                </li>
                <li>
                  <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                    Alumni Network
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="sm:text-sm text-xs  font-semibold mb-4">Contact</h4>
              <div className="sm:text-sm text-xs space-y-2 opacity-80">
                <p>123 University Avenue</p>
                <p>Excellence City, EC 12345</p>
                <p>Phone: (555) 123-4567</p>
                <p>Email: info@excellence.edu</p>
              </div>
            </div>
          </div>

          <div className="border-t border-background/20 mt-4 pt-8 text-center mb-4 sm:text-sm text-xs opacity-80">
            <p>&copy; 2024 Excellence University. All rights reserved.</p>
          </div>
        </div>
    </footer>
  )
}
