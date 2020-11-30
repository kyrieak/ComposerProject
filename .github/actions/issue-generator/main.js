const core = require('@actions/core');
const github = require('@actions/github');

// TODO 1f - probably clean info
const formatIssuePayload = (issueInfo, branchname) => {
    let issueBody = `\`\`\`\n` + issueInfo.hunk + `\n\`\`\`\n`

    issueBody += `**branch:** ${branchname}\n`
    issueBody += `**file:** ${issueInfo.filename}`

    return {
        title: issueInfo.todoLine.substring(issueInfo.todoLine.indexOf('TODO')),
        body: issueBody
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
        let splitPatch = file.patch.split(/(@@ -\d+,\d+ \+\d+,\d+ @@)/gm)
        let hunkStr = ''

        splitPatch.forEach((hunkPiece, index) => {
            if (hunkPiece.match(/@@ -\d+,\d+ \+\d+,\d+ @@/)) {
                hunkStr = hunkPiece
            } else {
                hunkStr += hunkPiece

                let matches = hunkPiece.match(/^\+[^\r\n]*TODO[^\r\n]*$/gm)

                if (matches) {
                    matches.forEach((match) => {
                        console.log('FOUND MATCH!', match)
                        todos.push(formatIssuePayload({
                            todoLine: match,
                            filename: file.filename,
                            hunk: hunkStr
                        }, branchname))
                    })
                }
            }
        })
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
        let newIssues = []
        // TODO 2f - just to trigger issue
        issues.forEach((issue) => {
            let newIssue = octokit.issues.create({
                ...context.repo,
                title: issue.title,
                body: issue.body,
                labels: ['todo']
            });

            newIssues.push(newIssue)
        })

        // TODO - to trigger new issue
        let newIssueResponses = await Promise.all(newIssues)
        newIssueResponses = newIssueResponses.map((resp) => { return resp.data.number })
        core.setOutput('newIssueNumbers', JSON.stringify(newIssueResponses))
    } catch (error) {
        console.error('error: ', error);
    }
}

run();
