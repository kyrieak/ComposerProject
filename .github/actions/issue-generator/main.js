const core = require('@actions/core');
const github = require('@actions/github');

// TODO provide more context ...
const formatIssuePayload = (issueInfo, branchname) => {
    let infotable = `
        | branch         | file          |
        |-|-|
        | ${ branchname} | ${ filename } |`

    return {
        title: issueInfo.todoLine.substring(issueInfo.todoLine.indexOf('TODO')),
        body: infotable
    }
}

const parseDiffForIssue = async (octokit, base, head, branchname) => {
    var resp = await octokit.repos.compareCommits({
        owner: 'kyrieak',
        repo: 'ComposerProject',
        base,
        head,
    });

    const files = resp.data.files
    let todos = []

    files.forEach((file) => {
        let matches = file.patch.match(/^\+[^\r\n]*TODO[^\r\n]*$/gm)

        if (matches) {
            matches.forEach((match) => {
                console.log('FOUND MATCH!', match)
                todos.push(formatIssuePayload({
                    todoLine: match,
                    filename: file.filename,
                    patch: file.patch
                }, branchname))
            })
        }
    })

    return todos
}


async function run() {

    try {
        const before_sha = core.getInput('before_sha');
        const latest_sha = core.getInput('latest_sha')
        const octokit = github.getOctokit(core.getInput('token'));
        const context = github.context;
        const event_name = core.getInput('event_name')

        let branchname;

        if (event_name === 'push') {
            branchname = core.getInput('ref').substring('refs/heads/'.length)
        } else if (event_name === 'pull_request') {
            branchname = core.getInput('head_ref');
        }

        let issues = await parseDiffForIssue(octokit, before_sha, latest_sha, branchname)

        issues.forEach((issue) => {
            octokit.issues.create({
                ...context.repo,
                title: issue.title,
                body: issue.body,
                labels: ['todo']
            });
        })
    } catch (error) {
        console.error('error: ', error);
    }
}

run();
