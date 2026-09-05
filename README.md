# Calculate with Soulver — LaunchBar action

Type an expression into LaunchBar and get a live answer from
[Soulver](https://soulver.app). This is a fork of Christian Bender's
[Calculate with Soulver](https://github.com/Ptujec/LaunchBar/tree/master/Calculate-Soulver)
action (v1.4.1), updated for Soulver 4 and version 2 of the Soulver CLI.

## Usage

| | |
| --- | --- |
| `↩` | Show the answer in LaunchBar |
| `⇧↩` | Paste the answer into the frontmost app |
| `⌘↩` | Open the expression as a new sheet in Soulver |

## Requirements

Soulver 4, and/or the `soulver` command line tool. The action looks for it in
this order:

1. `/opt/homebrew/bin/soulver`
2. `/usr/local/bin/soulver`
3. `/Applications/Soulver.app/Contents/MacOS/CLI/soulver`

A standalone install (`brew install --cask soulver-cli`, or Soulver →
Install Command Line Tool…) is preferred over the copy inside the app
bundle, which is sandboxed and so cannot read your sheetbook definitions
and custom units.

## Installation

Double click the action to open it in LaunchBar.

## What changed from the original

* Uses the v2.x CLI that ships with Soulver 4 (or is installed via homebrew).
* Uses the new `auto-convert` feature which turns a lone result to its counterpart: e.g. `20 C` → `68 °F`.
* Fixes a possible bug where `⇧↩` could paste an error string.
  * The original checked `shiftKey` before checking the result, so a failed evaluation could be pasted into the frontmost app. The order is now reversed.
* The `documentation.soulver.app/documentation/command-line-tool-automator-and-services` URL now 404s; CLI documentation lives at [soulverteam/Soulver-CLI](https://github.com/soulverteam/Soulver-CLI) and the integration pages moved under `/documentation/integrations/`.

### Update URL removed

`LBUpdateURL` pointed at the upstream action's `Info.plist`, so LaunchBar's
update check would have overwritten all of the above with the Soulver 3
version.

## License

MIT, see [LICENSE](LICENSE).

Derived from Christian Bender's original action, also MIT licensed
(Copyright © 2022 Christian Bender, see
[Ptujec/LaunchBar](https://github.com/Ptujec/LaunchBar/blob/master/LICENSE)).
