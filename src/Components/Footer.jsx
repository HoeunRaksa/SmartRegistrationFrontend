import React from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../Components/ui/Card";

export function Footer() {
  return (
    <footer className="bg-foreground text-white text-background py-12">
      <Card>
        <div className="container mx-auto mt-4 px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Excellence University</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Empowering minds and shaping the future through innovative education and groundbreaking research.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
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
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
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
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="text-sm space-y-2 opacity-80">
                <p>123 University Avenue</p>
                <p>Excellence City, EC 12345</p>
                <p>Phone: (555) 123-4567</p>
                <p>Email: info@excellence.edu</p>
              </div>
            </div>
          </div>

          <div className="border-t border-background/20 mt-4 pt-8 text-center mb-4 text-sm opacity-80">
            <p>&copy; 2024 Excellence University. All rights reserved.</p>
          </div>
        </div>
      </Card>
    </footer>
  )
}
