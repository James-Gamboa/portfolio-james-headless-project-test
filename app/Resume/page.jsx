"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header/page";
import ProjectResume from "@/components/ProjectResume/page";
import Socials from "@/components/Socials/page";
import Button from "@/components/Button/page";
import { getData } from "@/api/portfolio/strapi";

const Resume = () => {
  const router = useRouter();
  const [mount, setMount] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getData();
        
        if (result && result.attributes) {
          setPortfolioData(result.attributes);
          if (!result.attributes.showResume) {
            router.push("/");
          }
        } else {
          throw new Error('Invalid data structure received from API');
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError(error.message);
      } finally {
        setLoading(false);
        setMount(true);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="relative">
        <div className="gradient-circle"></div>
        <div className="gradient-circle-bottom"></div>
        <div className="container mx-auto mb-10">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
              <div className="text-xl text-white animate-pulse">Loading resume content...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <div className="gradient-circle"></div>
        <div className="gradient-circle-bottom"></div>
        <div className="container mx-auto mb-10">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl text-red-500">
              <p>Oops! Something went wrong.</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="relative">
        <div className="gradient-circle"></div>
        <div className="gradient-circle-bottom"></div>
        <div className="container mx-auto mb-10">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl">No resume data available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`container mx-auto mb-10 ${
          portfolioData?.showCursor ? "cursor-none" : ""
        }`}
      >
        <Header isBlog />
        {mount && (
          <div className="mt-10 w-full flex flex-col items-center">
            <div className="w-full bg-slate-800 max-w-4xl p-20 mob:p-5 desktop:p-20 rounded-lg shadow-sm">
              <h1 className="text-3xl font-bold">{portfolioData.name}</h1>
              <h2 className="text-xl mt-5">{portfolioData.resume?.tagline || ""}</h2>
              <h2 className="w-4/5 text-xl mt-5 opacity-50">
                {portfolioData.resume?.description || ""}
              </h2>
              <div className="mt-2">
                <Socials socials={portfolioData.socials || []} />
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-bold">Experience</h1>
                {portfolioData.resume?.experiences?.length > 0 ? (
                  portfolioData.resume.experiences.map(({ id, dates, type, position, bullets }) => (
                    <ProjectResume
                      key={id}
                      dates={dates}
                      type={type}
                      position={position}
                      bullets={bullets}
                    />
                  ))
                ) : (
                  <p className="text-gray-400">No experience data available</p>
                )}
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-bold">Education</h1>
                <div className="mt-2">
                  <h2 className="text-lg">
                    {portfolioData.resume?.education?.universityName || ""}
                  </h2>
                  <h3 className="text-sm opacity-75">
                    {portfolioData.resume?.education?.universityDate || ""}
                  </h3>
                  <p className="text-sm mt-2 opacity-50">
                    {portfolioData.resume?.education?.universityPara || ""}
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <h1 className="text-2xl font-bold">Skills</h1>
                <div className="flex mob:flex-col desktop:flex-row justify-between">
                  {portfolioData.resume?.languages?.length > 0 && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-lg">Languages</h2>
                      <ul className="list-disc">
                        {portfolioData.resume.languages.map((language, index) => (
                          <li key={index} className="ml-5 py-2">
                            {language}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {portfolioData.resume?.frameworks?.length > 0 && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-lg">Frameworks</h2>
                      <ul className="list-disc">
                        {portfolioData.resume.frameworks.map((framework, index) => (
                          <li key={index} className="ml-5 py-2">
                            {framework}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {portfolioData.resume?.others?.length > 0 && (
                    <div className="mt-2 mob:mt-5">
                      <h2 className="text-lg">Others</h2>
                      <ul className="list-disc">
                        {portfolioData.resume.others.map((other, index) => (
                          <li key={index} className="ml-5 py-2">
                            {other}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Resume;