import axios from "axios";

const PROJECT_URL =
  "https://erpupgradeback-1jtf.onrender.com/api/projects";

export interface ProjectResponse {
  pagination?: {
    total: number;
  };
}

// Total Projects
export const getProjects = async (): Promise<ProjectResponse | null> => {
  try {
    const response = await axios.get<ProjectResponse>(PROJECT_URL);
    return response.data;
  } catch (error) {
    console.error("Project API Error:", error);
    return null;
  }
};

// Projects by Status
export const getProjectsByStatus = async (
  status: string
): Promise<ProjectResponse | null> => {
  try {
    const response = await axios.get<ProjectResponse>(
      `${PROJECT_URL}?status=${encodeURIComponent(status)}`
    );

    return response.data;
  } catch (error) {
    console.error(`${status} API Error:`, error);
    return null;
  }
};