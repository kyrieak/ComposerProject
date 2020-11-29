const core = require('@actions/core');
const github = require('@actions/github');
//import parseDiffForIssue from "./parseDiffFromIssue.js";

async function run() {

    try {
        console.log('before_sha: ', core.getInput('before_sha'));
        console.log('latest_sha: ', core.getInput('latest_sha')); 
        const octokit = github.getOctokit(core.getInput('token'));
        const context = github.context;
        const event_name = core.getInput('event_name')

        let branchname;

        console.log('event_name: ', core.getInput('event_name'));

        if (event_name === 'push') {
            branchname = core.getInput('ref')
        } else if (event_name === 'pull_request') {
            branchname = core.getInput('head_ref');
        }
        
        console.log('branchname: ', branchname);

        //parseDiffForIssue(octokit)

        /*octokit.issues.create({
            ...context.repo,
            title: 'Hello',
            body: 'World',
        });*/
    } catch (error) {
        console.error('error: ', error);
    }
}

run();
