#!/usr/bin/env bash

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HARNESS_PATH="$ROOT_DIR/scripts/local_harness.sh"
COMMAND_NAME="${1:-chiro}"

if [[ ! -f "$HARNESS_PATH" ]]; then
	echo "❌ Harness not found at $HARNESS_PATH"
	exit 1
fi

chmod +x "$HARNESS_PATH"

TARGET_DIR=""
if [[ -w "/usr/local/bin" ]]; then
	TARGET_DIR="/usr/local/bin"
else
	TARGET_DIR="$HOME/.local/bin"
	mkdir -p "$TARGET_DIR"
fi

ln -sf "$HARNESS_PATH" "$TARGET_DIR/$COMMAND_NAME"

echo "✅ Installed harness as '$COMMAND_NAME' -> $TARGET_DIR/$COMMAND_NAME"
echo ""
echo "Usage examples:"
echo "  $COMMAND_NAME start all"
echo "  $COMMAND_NAME status all"
echo "  $COMMAND_NAME restart backend"
echo ""

if [[ "$TARGET_DIR" == "$HOME/.local/bin" ]]; then
	case ":$PATH:" in
		*":$HOME/.local/bin:"*) ;;
		*)
			echo "ℹ️  $HOME/.local/bin is not on your PATH."
			echo "   Add this line to your shell config (~/.zshrc) and restart terminal:"
			echo '   export PATH="$HOME/.local/bin:$PATH"'
			;;
	esac
fi




