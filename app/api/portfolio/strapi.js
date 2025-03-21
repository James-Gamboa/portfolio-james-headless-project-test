const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost") {
      return "http://localhost:1337";
    }
  }
  return process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
};

export async function query(url) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api${url}`, {
      headers: {
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      console.error("Response status:", response.status);
      console.error("Response headers:", response.headers);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

const CACHE_KEY = "portfolio_data";
const CACHE_DURATION = 5 * 60 * 1000; 
export async function getData() {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      if (now - timestamp < CACHE_DURATION) {
        return data;
      }
    }

    const res = await query(
      "/portfolio?populate[projects][populate]=imageSrc&populate[resume][populate][]=experiences&populate[resume][populate][]=education&populate[socials][populate]=*&populate[Services][populate]=*"
    );
    
    if (!res.data) {
      throw new Error("No data received from API");
    }

    const transformedData = {
      ...res.data,
      attributes: {
        ...res.data,
        projects: res.data.projects || [],
        services: res.data.Services || [],
        Socials: res.data.Socials?.data || [],
        resume: res.data.resume || {
          tagline: "",
          description: "",
          experiences: [],
          education: {
            universityName: "",
            universityDate: "",
            universityPara: ""
          },
          languages: [],
          frameworks: [],
          others: []
        }
      }
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: transformedData,
      timestamp: Date.now()
    }));

    return transformedData;
  } catch (error) {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { data } = JSON.parse(cachedData);
      return data;
    }
    
    console.error("Error in getData:", error);
    throw error;
  }
}

export async function updateDataInBackground() {
  try {
    const res = await query(
      "/portfolio?populate[projects][populate]=imageSrc&populate[resume][populate][]=experiences&populate[resume][populate][]=education&populate[socials][populate]=*&populate[Services][populate]=*"
    );
    
    if (res.data) {
      const transformedData = {
        ...res.data,
        attributes: {
          ...res.data,
          projects: res.data.projects || [],
          services: res.data.Services || [],
          Socials: res.data.Socials?.data || [],
          resume: res.data.resume || {
            tagline: "",
            description: "",
            experiences: [],
            education: {
              universityName: "",
              universityDate: "",
              universityPara: ""
            },
            languages: [],
            frameworks: [],
            others: []
          }
        }
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: transformedData,
        timestamp: Date.now()
      }));

      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating data in background:", error);
    return false;
  }
}

if (process.env.NODE_ENV === "development") {
  (async () => {
    try {
      const data = await getData();
      console.log("Datos obtenidos:", data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  })();
}