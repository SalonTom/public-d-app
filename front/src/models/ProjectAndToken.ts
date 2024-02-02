import type Project from "./Project";

export default class ProjectAndToken {
    public project : Project;
    public token : string;

    constructor(
        project: Project,
        token: string
    ) {
        this.project = project;
        this.token = token;
    }

}