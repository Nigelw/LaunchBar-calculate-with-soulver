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

Soulver 4, plus the `soulver` command line tool. The action looks for it in
this order:

1. `/opt/homebrew/bin/soulver`
2. `/usr/local/bin/soulver`
3. `/Applications/Soulver.app/Contents/MacOS/CLI/soulver`

A standalone install (`brew install --cask soulver-cli`, or Soulver →
Install Command Line Tool…) is preferred over the copy inside the app
bundle, which is sandboxed and so cannot read your sheetbook definitions
and custom units.

## Installation

```sh
ln -s "$PWD/Calculate with Soulver.lbaction" ~/Library/Application\ Support/LaunchBar/Actions/
```

A symlink means edits take effect without recopying. `cp -R` works too.

## What changed from the original

The original targeted Soulver 3 and the CLI that shipped with it. Soulver 4
replaced that CLI with a subcommand-based tool (v2.x). A bare expression is
still an implicit `eval`, so the core call survives; everything around it
needed work.

### The CLI is found at runtime

The original hardcoded `/Applications/Soulver 3.app/Contents/MacOS/CLI/soulver`,
which does not exist in a Soulver 4 install. The path is now resolved from the
candidate list above.

### Error detection was broken

CLI v2 writes errors to stderr and leaves stdout empty, so the original's
`result.startsWith('Error')` check never fired — unparseable input produced no
feedback at all rather than the intended error state. An empty result is now
treated as a failure. The prefix check is kept in case LaunchBar merges stderr
into the result.

Because there is no longer any error text on stdout to distinguish, the
`error` icon has no reachable code path and `error.png` is unused. Restoring
that feedback is possible via `eval --strict --json`, which reports failures
as structured output.

### `⇧↩` could paste an error string

The original checked `shiftKey` before checking the result, so a failed
evaluation could be pasted into the frontmost app. The order is reversed.

### Answers auto-convert

Evaluation passes `--auto-convert`, which turns a lone result into its natural
counterpart: `12 kg` answers `26.46 lb`, `20 C` answers `68 °F`. Expressions
that already carry a unit or an explicit conversion are unaffected. Requires
CLI v2.2 or later.

The expression is passed after `--` so that an input which looks like a flag
(`-h`, `--version`) is not consumed by the argument parser and answered with
the CLI's own help output.

### Bundle identifier

`CFBundleIconFile`, `LBAssociatedApplication` and `LBRequiredApplication` were
all `app.soulver.mac`, which is Soulver 3. They now name
`app.soulver.appstore.mac`, the Mac App Store build of Soulver 4. **If you run
the direct-download build instead, these three keys are the ones to change** —
under a mismatched identifier LaunchBar hides the action entirely.

### Update URL removed

`LBUpdateURL` pointed at the upstream action's `Info.plist`, so LaunchBar's
update check would have overwritten all of the above with the Soulver 3
version.

### Documentation links

The `documentation.soulver.app/documentation/command-line-tool-automator-and-services`
URL now 404s; CLI documentation lives at
[soulverteam/Soulver-CLI](https://github.com/soulverteam/Soulver-CLI) and the
integration pages moved under `/documentation/integrations/`.

## Notes

Soulver 4's `x-callback-url` scheme still supports `create?expression=`, so
`⌘↩` is unchanged. Soulver 3 and Soulver 4 both claim the `x-soulver` scheme,
so with both installed LaunchServices decides which one opens.

## License

Inherits the original's license: see
[Ptujec/LaunchBar](https://github.com/Ptujec/LaunchBar/blob/master/LICENSE).
