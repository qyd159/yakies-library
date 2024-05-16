#!/bin/bash

if [[ $(git status --porcelain) && $2 != 'direct' ]]; then
  pnpm changeset version
  git add .
  git commit
  git push origin main
  pnpm --dir packages/$1 run build
else
  echo "跳过预处理"
fi
if [ $1 = "all" ]; then
  pnpm publish -r
else
  pnpm publish --filter $1 --registry 'https://npm.yakies.cn/repository/hosted/' --no-git-checks
fi
