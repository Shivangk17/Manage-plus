import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    return(
        <div>
            <footer className="bg-[#ffffff] mt-auto py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-auto mb-8 md:mb-0">
              <svg className="w-8 h-8 text-[#134151]" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
              <p className="mt-4 text-sm text-[#134151]">&copy; 2023 Manage+ Inc.</p>
              <p className="text-sm text-[#134151]">Design by Pixel Point</p>
            </div>
            <div className="w-full md:w-auto flex flex-wrap justify-between md:justify-end">
              {[
                {
                  title: "DEVELOPERS",
                  links: ["Documentation", "Plugins", "Support"]
                },
                {
                  title: "COMMUNITY",
                  links: ["GitHub", "Twitter", "Discourse"]
                },
                {
                  title: "COMPANY",
                  links: ["Harness Inc.", "Branding"]
                },
                {
                  title: "LEGAL",
                  links: ["License"]
                },
                {
                  title: "PRIVACY",
                  links: ["Privacy Policy", "Manage Preferences", "Do Not Sell or Share My Personal Information"]
                }
              ].map((category) => (
                <div key={category.title} className="w-1/2 md:w-auto mb-8 md:mb-0 md:ml-12">
                  <h3 className="font-semibold text-[#134151] mb-4">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.links.map((item) => (
                      <li key={item}>
                        <a href="#" className="text-sm text-[#134151] hover:text-[#1c5b70]">{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
        </div>
    );
};
export default Footer;