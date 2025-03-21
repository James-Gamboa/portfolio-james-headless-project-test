"use client";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header/page";
import ServiceCard from "@/components/ServiceCard/page";
import Socials from "@/components/Socials/page";
import WorkCard from "@/components/WorkCard/page";
import Footer from "@/components/Footer/page";
import { getData, updateDataInBackground } from "@/api/portfolio/strapi";

export default function Home() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  const workRef = useRef();
  const aboutRef = useRef();
  const textOne = useRef();
  const textTwo = useRef();
  const textThree = useRef();
  const textFour = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getData();
        
        if (result && result.attributes) {
          setPortfolioData(result.attributes);
        } else {
          throw new Error('Invalid data structure received from API');
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError(error.message);
      } finally {
        setLoading(false);
        setIsFirstLoad(false);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      if (!loading) {
        updateDataInBackground().then(updated => {
          if (updated) {
            fetchData();
          }
        });
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const renderServices = () => {
    if (!portfolioData?.services?.length) {
      return <div>No services available</div>;
    }
    
    return portfolioData.services.map((service) => (
      <ServiceCard
        key={service.id}
        name={service.title}
        description={service.description}
      />
    ));
  };
  
  const renderProjects = () => {
    if (!portfolioData?.projects?.length) {
      return <div>No projects available</div>;
    }
    
    return portfolioData.projects.map((project) => (
      <WorkCard
        key={project.id}
        img={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${project.imageSrc?.url || ""}`}
        name={project.title}
        description={project.description}
        onClick={() => window.open(project.url)}
      />
    ));
  };

  const handleWorkScroll = () => {
    window.scrollTo({
      top: workRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleAboutScroll = () => {
    window.scrollTo({
      top: aboutRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  if (loading && isFirstLoad) {
    return (
      <div className="relative">
        <div className="gradient-circle"></div>
        <div className="gradient-circle-bottom"></div>
        <div className="container mx-auto mb-10">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
              <div className="text-xl text-white animate-pulse">Loading amazing content...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !portfolioData) {
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
            <div className="text-xl">No portfolio data available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${portfolioData?.showCursor ? "cursor-none" : ""}`}>
      {portfolioData?.showCursor}
      <div className="gradient-circle"></div>
      <div className="gradient-circle-bottom"></div>
      <div className="container mx-auto mb-10">
        <Header
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
          showResume={portfolioData.showResume}
        />
        <div className="laptop:mt-20 mt-10">
          <div className="mt-5">
            <h1
              ref={textOne}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-4/5 mob:w-full laptop:w-4/5"
            >
              {portfolioData.headerTaglineOne}
            </h1>
            <h1
              ref={textTwo}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
            >
              {portfolioData.headerTaglineTwo}
            </h1>
            <h1
              ref={textThree}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
            >
              {portfolioData.headerTaglineThree}
            </h1>
            <h1
              ref={textFour}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5"
            >
              {portfolioData.headerTaglineFour}
            </h1>
          </div>
          <Socials className="mt-2 laptop:mt-5" socials={portfolioData.socials} />
        </div>
        <div
          className="mt-10 laptop:mt-30 p-2 laptop:p-0"
          ref={workRef}
          id="work"
        >
          <h1 className="text-2xl text-bold">Work.</h1>
          <div className="mt-5 laptop:mt-10 grid grid-cols-1 tablet:grid-cols-2 gap-4">
            {renderProjects()}
          </div>
        </div>
        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0">
          <h1 className="tablet:m-10 text-2xl text-bold">Services.</h1>
          <div className="mt-5 tablet:m-10 grid grid-cols-1 laptop:grid-cols-2 gap-6">
            {renderServices()}
          </div>
        </div>
        <div
          className="mt-10 laptop:mt-40 p-2 laptop:p-0"
          ref={aboutRef}
          id="about"
        >
          <h1 className="tablet:m-10 text-2xl text-bold">About.</h1>
          <p className="tablet:m-10 mt-2 text-xl laptop:text-3xl w-full laptop:w-3/5">
            {portfolioData.aboutpara}
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}
