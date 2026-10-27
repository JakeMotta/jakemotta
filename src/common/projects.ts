import { HomeProject, homeProjectList, projectCategories } from './constants';

/**
 * The projects sorted into their categories, each newest first. Dates are only years, so
 * projects from the same year keep their order in `homeProjectList`, which is newest first too.
 */
export const projectSections = projectCategories
    .map((category) => ({
        ...category,
        projects: homeProjectList.filter((project) => project.category === category.id).sort((a, b) => Number(b.date) - Number(a.date)),
    }))
    .filter((section) => section.projects.length > 0);

/** Every project in the order the all-projects overlay shows them, which the viewer's Back and Forward follow. */
export const orderedProjects: HomeProject[] = projectSections.flatMap((section) => section.projects);
