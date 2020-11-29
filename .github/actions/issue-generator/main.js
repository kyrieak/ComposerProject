const core = require('@actions/core');
const github = require('@actions/github');
//import parseDiffForIssue from "./parseDiffFromIssue.js";

async function run() {

    try {
        console.log('before_sha: ', core.getInput('before_sha'));
        console.log('latest_sha: ', core.getInput('latest_sha')); 
        const octokit = github.getOctokit(core.getInput('token'));
        const context = github.context;
        console.log('GITHUB_EVENT_NAME: ', GITHUB_EVENT_NAME);
        console.log('GITHUB_HEAD_REF: ', GITHUB_HEAD_REF);

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
