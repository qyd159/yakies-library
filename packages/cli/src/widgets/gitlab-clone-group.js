const path = require('path')

const { Gitlab } = require('@gitbeaker/node');
const cmd = require('node-cmd-promise')
// import Gitlab from 'gitlab'

function error(msg) {
    console.error(msg)
    process.exit(1)
}

module.exports = async function main() {
    const args = require('yargs')
        .options(options)
        .argv
    const api = new Gitlab({
        host: args.host || '',
        // 如果是gitlab.dm-ai.cn,则token是4fGPkgPWZXyziUzyzNcV
        token: args.token || 'GuEHS12G3XiQvyTPdseJ'
    })

    const allGroups = await api.Groups.all()

    const matchingGroups = allGroups.filter((g) => g.name === args.group)
    if (matchingGroups.length === 0) error(`Didn't find a group named ${args.group}!`)

    const group = matchingGroups[0]

    const projects = await api.Search.all('projects','',{groupId: group.id})

    const regex = new RegExp(args.project)

    for (const project of projects) {
        if(regex.test(project.name))
        await cloneProject(project, args.method, args.folder)
    }
}

function cloneProject(project, method, folder) {
    const url = project[`${method}_url_to_repo`]
    const dest = path.join(folder, project.name)
    console.log(`Cloning ${project.name} from '${url}'...`)
    return cmd(`git clone ${url} ${dest}`).catch((e) => console.error('Could not clone:', e))
}

const options = {
    'token': {
        alias: 't',
        demandOption: true,
        description: 'GitLab personal API token (generate one from your profile)',
        type: 'string',
    },
    'host': {
        alias: 'u',
        description: 'the URL of the GitLab server (defaults to gitlab.com)',
        default: 'https://gitlab.chumahtung.com/',
        type: 'string'
    },
    'group': {
        alias: 'g',
        demandOption: true,
        description: 'the name of the group to clone',
        type: 'string',
    },
    'method': {
        alias: 'm',
        choices: ['http', 'ssh'],
        default: 'http',
        description: 'the method used to clone the project',
        type: 'string'
    },
    'project': {
      alias: 'p',
      default: 'http',
      description: 'the regex pattern used to filter projects',
      type: 'string'
    },
    'folder': {
        alias: 'f',
        default: 'cloned',
        description: 'the folder to put the cloned repos into',
        type: 'string'
    }
}
