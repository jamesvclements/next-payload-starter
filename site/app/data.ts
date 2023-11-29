import { Footer, Project, Home, Nav } from "@cms/payload-types";

const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
  next: {
    tags: ['cms']
  }
};



export const getNav = async (): Promise<Nav> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/globals/nav?depth=1`, {
    ...defaultOptions
  });
  return response.json();
};

export const getFooter = async (): Promise<Footer> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/globals/footer?depth=1`, {
    ...defaultOptions
  });
  return response.json();
};


export const getHomepage = async (): Promise<Home> => {
  const [homeResponse] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/globals/home?depth=2`, {
      ...defaultOptions
    }),
  ]);

  const home = await homeResponse.json();
  return home;
};

export const getAllProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/globals/settings`, {
    ...defaultOptions
  });
  const data = await response.json();
  return data.projectSortOrder;
};

export const getProject = async (slug: string): Promise<Project> => {
  const id = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql`, {
    ...defaultOptions,
    method: 'POST',
    body: JSON.stringify({
      query: `
          query {
            Projects(where: { slug: { equals: "${slug}" } }) {
              docs {
                id
              }
            }
          }
        `
    }),
  }
  ).then((res) => res.json())
    .then((res) => res.data.Projects.docs[0].id);

  const project = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/projects/${id}`, {
    ...defaultOptions
  }).then((res) => res.json());

  return project;
};
