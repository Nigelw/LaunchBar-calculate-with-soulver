/* 
Soulver CL Action for LaunchBar
by Christian Bender (@ptujec)
2022-06-16

Updated for Soulver 4 / Soulver CLI v2

Copyright see: https://github.com/Ptujec/LaunchBar/blob/master/LICENSE

Documentation:
- https://documentation.soulver.app/documentation/integrations/command-line-tool-automator-and-services
- https://github.com/soulverteam/Soulver-CLI
*/

const soulverAppID = 'app.soulver.appstore.mac';

const cliHelpURL = 'https://github.com/soulverteam/Soulver-CLI';

// --auto-convert was added in CLI v2.2. Older builds do not recognise it and
// fold it into the expression instead, which silently returns a wrong answer.
const minAutoConvertVersion = [2, 2];

// Checked in order. The standalone CLI (Homebrew or a manual install) is
// preferred over the copy inside the app bundle: it is newer, it is not
// sandboxed, and so it can read your sheetbook definitions and custom units.
const cliCandidates = [
  '/opt/homebrew/bin/soulver',
  '/usr/local/bin/soulver',
  '/Applications/Soulver.app/Contents/MacOS/CLI/soulver',
];

const soulverCLI = cliCandidates.find((path) => File.exists(path));

// Costs about 10ms against the ~200ms of an evaluation, so it is cheap enough
// to run on every invocation, including live feedback in suggestions.js.
function supportsAutoConvert(cliPath) {
  const version = LaunchBar.execute(cliPath, '--version')
    .trim()
    .match(/(\d+)\.(\d+)/);

  if (version === null) return false;

  const major = parseInt(version[1], 10);
  const minor = parseInt(version[2], 10);

  return (
    major > minAutoConvertVersion[0] ||
    (major === minAutoConvertVersion[0] && minor >= minAutoConvertVersion[1])
  );
}

const autoConvert =
  soulverCLI !== undefined && supportsAutoConvert(soulverCLI);

function calculate(expression) {
  // '--' keeps an expression that starts with a minus sign (e.g. '-5 + 3')
  // from being read as an option.
  const args = ['eval'];
  if (autoConvert) args.push('--auto-convert');
  args.push('--', expression);

  // CLI v2 writes errors to stderr and leaves stdout empty, so an empty
  // result means the expression was not understood. Older code looked for an
  // 'Error' prefix on stdout; that is still checked in case LaunchBar merges
  // stderr into the result.
  const result = LaunchBar.execute
    .apply(LaunchBar, [soulverCLI].concat(args))
    .trim();

  if (result === '' || result.startsWith('Error')) return undefined;
  return result;
}

function run(argument) {
  if (LaunchBar.options.commandKey) {
    LaunchBar.openURL(
      'x-soulver://x-callback-url/create?&expression=' + encodeURI(argument)
    );
    return;
  }

  if (soulverCLI === undefined) {
    const response = LaunchBar.alert(
      'Missing Soulver command line tool',
      'The "soulver" command line tool was not found. Install it with "brew install --cask soulver-cli", or from Soulver 4 choose Soulver → Install Command Line Tool…',
      'Help',
      'Cancel'
    );
    if (response === 0) LaunchBar.openURL(cliHelpURL);
    return;
  }

  const result = calculate(argument);

  if (result === undefined) return;

  if (LaunchBar.options.shiftKey) return LaunchBar.paste(result);

  return [
    {
      title: result,
      subtitle: argument,
      alwaysShowsSubtitle: true,
      icon: soulverAppID,
    },
  ];
}
