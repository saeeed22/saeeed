import { ProjectsClient } from "@/components/sections/projects-client";
import { listPublishedProjects } from "@/lib/projects-repo";

export async function Projects() {
  const items = await listPublishedProjects();
  return <ProjectsClient projects={items} />;
}
