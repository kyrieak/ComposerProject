export default async function parseDiffForIssue(octokit) {
    var resp = await octokit.repos.compareCommits({
        'kyrieak',
        'ComposerProject',
        base,
        head,
    });
}
