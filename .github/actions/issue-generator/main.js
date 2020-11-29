const core = require('@actions/core')
const github = require('@actions/github');

try {
  console.log('before_sha: ', core.getInput('before_sha'));
  console.log('latest_sha: ', core.getInput('latest_sha'));
} catch (error) {
  console.error('error: ', error)
}
