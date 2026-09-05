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

include('default.js');

function runWithString(string) {
  if (string === '') return;
  if (soulverCLI === undefined) return;

  const result = calculate(string);

  if (result === undefined) return;

  return {
    title: result,
    label: '⌘↩ = Open Entry in Soulver',
    icon: 'equal',
  };
}
