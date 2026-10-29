import { HomeProject, homeProjectList, projectCategories } from './constants';

/**
 * The projects sorted into their categories, in `homeProjectList`'s order (src/content.json's), which
 * is newest first apart from what Jake has placed by hand, like Black Chamber Redesign after Dan James.
 */
export const projectSections = projectCategories
    .map((category) => ({
        ...category,
        projects: homeProjectList.filter((project) => project.category === category.id),
    }))
    .filter((section) => section.projects.length > 0);

/** Every project in the order the all-projects overlay shows them, which the viewer's Back and Forward follow. */
export const orderedProjects: HomeProject[] = projectSections.flatMap((section) => section.projects);
