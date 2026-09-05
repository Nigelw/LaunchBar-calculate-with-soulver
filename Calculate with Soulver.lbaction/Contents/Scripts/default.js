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

// Checked in order. The standalone CLI (Homebrew or a manual install) is
// preferred over the copy inside the app bundle: it is newer, it is not
// sandboxed, and so it can read your sheetbook definitions and custom units.
const cliCandidates = [
  '/opt/homebrew/bin/soulver',
  '/usr/local/bin/soulver',
  '/Applications/Soulver.app/Contents/MacOS/CLI/soulver',
];

const soulverCLI = cliCandidates.find((path) => File.exists(path));

function calculate(expression) {
  // A bare expression is an implicit 'eval'. --auto-convert turns a lone
  // result into its natural counterpart (kg to lb, °C to °F), and '--' keeps
  // an expression that looks like a flag ('-h', '--version') from being read
  // as one.
  //
  // CLI v2 writes errors to stderr and leaves stdout empty, so an empty
  // result means the expression was not understood. Older code looked for an
  // 'Error' prefix on stdout; that is still checked in case LaunchBar merges
  // stderr into the result.
  const result = LaunchBar.execute(
    soulverCLI,
    '--auto-convert',
    '--',
    expression
  ).trim();

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
