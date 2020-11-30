const core = require('@actions/core');
const github = require('@actions/github');

// TODO 2
const formatIssuePayload = (issueInfo, branchname) => {
    return {
        title: issueInfo.todoLine,
        body: `${ issueInfo.filename }\n[${ branchname }]`
    }
}

const parseDiffForIssue = async (octokit, base, head) => {
    var resp = await octokit.repos.compareCommits({
        owner: 'kyrieak',
        repo: 'ComposerProject',
        base,
        head,
    });

    const files = resp.data.files
    let todos = []

    // TODO 1b
    files.forEach((file) => {
        let matches = file.patch.match(/^\+[^\r\n]*TODO[^\r\n]*$/gm)

        if (matches) {
            matches.forEach((match) => {
                console.log('FOUND MATCH!', match)
                todos.append(formatIssuePayload({
                    todoLine: match,
                    filename: file.filename,
                    patch: file.patch
                }))
            })
        }
    })

    return todos
}


// TODO 3b
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

        // TODO 4
        let issues = await parseDiffForIssue(octokit, before_sha, latest_sha)

        issues.forEach((issue) => {
            octokit.issues.create({
                ...context.repo,
                title: issue.title,
                body: issue.body,
            });
        })
    } catch (error) {
        console.error('error: ', error);
    }
}

run();
