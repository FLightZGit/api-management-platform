const Project = require('../models/project-model')

const getProjects = async (ctx) => {
    const projects = await Project.find({})

    ctx.body = projects
}

const getProjectById = async (ctx) => {
    const projectId = ctx.params.projectId
    const project = await Project.findById(projectId)

    ctx.body = project
}

const getProjectByProjectName = async (ctx) => {
    const projectname = ctx.request.body.projectname
    const projects = await Project.find({projectName : projectname})
    ctx.body = {
        projects
    }
}

const getProjectByUserName = async (ctx) => {
    const username = ctx.params.username
    const projects = await Project.find({projectCreator : username})
    ctx.body = projects
}

const createProject = async (ctx) => {
    const newProject = new Project(ctx.request.body)
    const savedProject = await newProject.save()

    ctx.body = savedProject
}

const updateProject = async (ctx) => {
    const body = ctx.request.body
    const projectId = ctx.params.projectId
    const project = await Project.findById(projectId)

    project.projectName = body.projectName
    project.projectCreator = body.projectCreator
    project.projectNote = body.projectNote

    const updatedProject = await project.save()

    ctx.body = updatedProject
}

const deleteProject = async (ctx) => {
    const projectId = ctx.params.projectId
    const project = await Project.findById(projectId)

    const deletedProject = await project.remove()

    ctx.body = await Project.find({})
}

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectByUserName,
    getProjectByProjectName
}