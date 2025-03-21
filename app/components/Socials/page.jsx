// @ts-nocheck
"use client"
import React, { useEffect, useState } from "react";
import Button from "@/components/Button/page";
import { getData } from "@/api/portfolio/strapi";

const Socials = ({ className }) => {
  const [socials, setSocials] = useState([]);
  const [showCopied, setShowCopied] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const data = await getData();
        setSocials(data.attributes.socials);
      } catch (error) {
        console.error("Error fetching socials:", error);
      }
    };

    fetchSocials();
  }, []);

  const handleSocialClick = async (social) => {
    if (social.title === "Email") {
      const email = social.Email;
      if (email) {
        window.location.href = `mailto:${email}`;
        
        try {
          const permissionStatus = await navigator.permissions.query({ name: "clipboard-write" });
          
          if (permissionStatus.state === "granted" || permissionStatus.state === "prompt") {
            await navigator.clipboard.writeText(email);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
          }
        } catch (error) {
          console.log("Clipboard not available, but mailto should work");
        }
      }
    } else {
      if (social.link) {
        window.open(social.link);
      }
    }
  };

  return (
    <div className="relative">
      <div className={`${className} flex flex-wrap mob:flex-nowrap link`}>
        {socials.map((social, index) => (
          <Button key={index} onClick={() => handleSocialClick(social)}>
            {social.title}
          </Button>
        ))}
      </div>
      {showCopied && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded text-sm">
          Email copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default Socials;
