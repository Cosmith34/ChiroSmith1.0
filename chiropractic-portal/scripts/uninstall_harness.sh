#!/usr/bin/env bash

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMMAND_NAME="${1:-chiro}"

removed_any=false

if [[ -L "/usr/local/bin/$COMMAND_NAME" || -f "/usr/local/bin/$COMMAND_NAME" ]]; then
	rm -f "/usr/local/bin/$COMMAND_NAME"
	echo "🗑  Removed /usr/local/bin/$COMMAND_NAME"
	removed_any=true
fi

if [[ -L "$HOME/.local/bin/$COMMAND_NAME" || -f "$HOME/.local/bin/$COMMAND_NAME" ]]; then
	rm -f "$HOME/.local/bin/$COMMAND_NAME"
	echo "🗑  Removed $HOME/.local/bin/$COMMAND_NAME"
	removed_any=true
fi

if [[ "$removed_any" == false ]]; then
	echo "ℹ️  No harness symlink named '$COMMAND_NAME' was found."
else
	echo "✅ Uninstall complete."
fi




