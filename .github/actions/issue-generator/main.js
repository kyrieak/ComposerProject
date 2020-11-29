const core = require('@actions/core');
const github = require('@actions/github');

const parseDiffForIssue = async (octokit, base, head) => {
    var resp = await octokit.repos.compareCommits({
        owner: 'kyrieak',
        repo: 'ComposerProject',
        base,
        head,
    });

    const files = resp.files

    // TODO 1
    files.forEach((file) => {
        let matches = file.patch.match(/^\+[^\r\n]*TODO[^\r\n]*$/gm)
        
        matches.forEach((match) => {
            console.log('FOUND MATCH!', match)
        })
    })
}

// TODO 2
const formatIssuePayload = (issueInfo, branchname) => {
    return {
        title: 'Placeholder',
        body: `[${ branchname }]`
    }
}

// TODO 3
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
        parseDiffForIssue(octokit, before_sha, latest_sha)

        /*octokit.issues.create({
            ...context.repo,
            title: 'Hello',
            body: '[' + branchname + ']',
        });*/
    } catch (error) {
        console.error('error: ', error);
    }
}

run();
