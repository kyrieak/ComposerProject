module.exports = async (octokit, base, head) => {
    var resp = await octokit.repos.compareCommits({
        'kyrieak',
        'ComposerProject',
        base,
        head,
    });
}
