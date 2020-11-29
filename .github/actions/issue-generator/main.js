const core = require('@actions/core');
const github = require('@actions/github');
import parseDiffForIssue from "./parseDiffFromIssue.js";

async function run() {

    try {
        console.log('before_sha: ', core.getInput('before_sha'));
        console.log('latest_sha: ', core.getInput('latest_sha')); 
        const octokit = github.getOctokit(core.getInput('token'));
        const context = github.context;
        console.log('github.event_name: ', github.event_name);
        console.log('github.head_ref: ', github.head_ref');

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
