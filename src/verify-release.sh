#!/bin/sh

# verify-release.sh <git-tag> <version>
#
# Exit non-zero when the tag exists on origin or the version exists on npm. A
# failed lookup counts as "does not exist".

set -eu

TAG=$1
VERSION=$2
NAME=$(node -p 'require("./package.json").name')

if git ls-remote --exit-code --tags origin "refs/tags/$TAG" >/dev/null; then
  printf 'Tag %s already exists on origin. A normal semantic-release run cannot lead to this state.\n' "$TAG" >&2
  exit 1
fi

if [ -n "$(npm view "$NAME@$VERSION" version 2>/dev/null)" ]; then
  printf 'Version %s already exists on npm. A normal semantic-release run cannot lead to this state.\n' "$VERSION" >&2
  exit 1
fi
