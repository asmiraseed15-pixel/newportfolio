


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api";

// Backend base URL
const BACKEND_ORIGIN = new URL(API_BASE_URL).origin;

// Convert backend media paths into correct URLs
const getBackendMediaUrl = (
  fileUrl: string | null
): string | null => {
  if (!fileUrl) return null;

  // Already an absolute URL
  if (/^https?:\/\//i.test(fileUrl)) {
    try {
      const parsedUrl = new URL(fileUrl);

      // Replace local media hostname with configured backend
      if (
        parsedUrl.pathname.startsWith("/media/") &&
        ["localhost", "127.0.0.1"].includes(parsedUrl.hostname)
      ) {
        return `${BACKEND_ORIGIN}${parsedUrl.pathname}${parsedUrl.search}`;
      }

      return fileUrl;
    } catch {
      return fileUrl;
    }
  }

  // Relative media path
  return `${BACKEND_ORIGIN}/${fileUrl.replace(/^\/+/, "")}`;
};


// 1. Contact Message Interface
export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}


// 2. Profile Interface
export interface PortfolioProfile {
  id: number;
  name: string;
  role: string;
  greeting: string;
  availability_text: string;
  hero_description: string;
  profile_image: string | null;
  hero_card_one: string;
  hero_card_two: string;
  email: string;
  phone: string;
  location: string;
  contact_intro: string;
  github_url: string;
  linkedin_url: string;
  footer_brand: string;
  footer_description: string;
  footer_links: unknown[];
  copyright_text: string;
  footer_credit: string;
  is_active: boolean;
}


// 3. About Interface
export interface AboutContent {
  id: number;
  heading: string;
  paragraphs: string[];
  tags: string[];
  learning_heading: string;
  learning_text: string;
  voice_label: string;
  voice_title: string;
  voice_audio: string | null;
  is_active: boolean;
}


// 4. Project Interface
export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string;
  github_url: string | null;
  live_url: string | null;
  image: string | null;
  icon: string;
  features: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
}


// 5. Skill Interface
export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon: string;
  display_order: number;
  is_active: boolean;
}


// 6. Experience Interface
export interface Experience {
  id: number;
  section_label: string;
  title: string;
  organization: string;
  description: string;
  period: string;
  display_order: number;
  is_active: boolean;
}


// 7. Education Interface
export interface Education {
  id: number;
  category: string;
  title: string;
  institution: string;
  year: string;
  details: string;
  icon: string;
  display_order: number;
  is_active: boolean;
}


// 8. Document Interface
export interface PortfolioDocument {
  id: number;
  document_type: "resume" | "degree" | "medical";
  title: string;
  description: string;
  preview_image: string | null;
  file: string | null;
  file_type: "image" | "pdf";
  download_name: string;
  display_order: number;
  is_active: boolean;
}


// 9. Service Interface
export interface Service {
  id: number;
  title: string;
  icon: string;
  description: string;
  display_order: number;
  is_active: boolean;
}


// 10. Complete Portfolio API Response
export interface PortfolioContent {
  profile: PortfolioProfile | null;
  about: AboutContent | null;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  documents: PortfolioDocument[];
  services: Service[];
}


// 11. Get All Portfolio Content
export const getPortfolioContent =
  async (): Promise<PortfolioContent> => {
    const response = await fetch(
      `${API_BASE_URL}/portfolio/`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch portfolio content"
      );
    }

    const data: PortfolioContent = await response.json();

    return {
      ...data,

      // Profile image URL
      profile: data.profile
        ? {
            ...data.profile,
            profile_image: getBackendMediaUrl(
              data.profile.profile_image
            ),
          }
        : null,

      // About voice audio URL
      about: data.about
        ? {
            ...data.about,
            voice_audio: getBackendMediaUrl(
              data.about.voice_audio
            ),
          }
        : null,

      // Project image URLs
      projects: data.projects.map((project) => ({
        ...project,
        image: getBackendMediaUrl(project.image),
      })),

      // Document PDF and preview image URLs
      documents: data.documents.map((item) => ({
        ...item,
        file: getBackendMediaUrl(item.file),
        preview_image: getBackendMediaUrl(
          item.preview_image
        ),
      })),
    };
  };


// 12. Submit Contact Message
export const submitContactMessage = async (
  data: ContactMessage
) => {
  const response = await fetch(
    `${API_BASE_URL}/contact/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      JSON.stringify(errorData)
    );
  }

  return response.json();
};


// 13. Get Projects
export const getProjects = async (): Promise<Project[]> => {
  const response = await fetch(
    `${API_BASE_URL}/projects/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
};


// 14. Get Skills
export const getSkills = async (): Promise<Skill[]> => {
  const response = await fetch(
    `${API_BASE_URL}/skills/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch skills");
  }

  return response.json();
};
