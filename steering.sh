#!/usr/bin/env bash
# Quick steering loader for chat-like usage.
# Usage: ./steering.sh <steering-name>
# Example: ./steering.sh ai

# Resolve the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load the mapping file
MAP_FILE="${SCRIPT_DIR}/steering_map.json"

# Function to extract the file path from JSON (fallback to jq if available)
get_path() {
  local name="$1"
  if command -v jq >/dev/null; then
    jq -r --arg k "$name" '.[$k]' "$MAP_FILE"
  else
    # Simple grep+sed fallback (expects no spaces in keys/values)
    grep -E "\"$name\"[[:space:]]*:" "$MAP_FILE" | head -n1 | sed -E "s/^[[:space:]]*\"[^\"]+\"[[:space:]]*:[[:space:]]*\"([^\"]+)\".*/\1/"
  fi
}

if [[ -z "$1" ]]; then
  echo "Usage: $0 <steering-name>"
  exit 1
fi

FILE_NAME=$(get_path "$1")
if [[ -z "$FILE_NAME" || "$FILE_NAME" == "null" ]]; then
  echo "Steering \"$1\" not found in $MAP_FILE"
  exit 1
fi

FULL_PATH="${SCRIPT_DIR}/${FILE_NAME}"
if [[ -f "$FULL_PATH" ]]; then
  cat "$FULL_PATH"
else
  echo "File \"$FULL_PATH\" does not exist."
  exit 1
fi