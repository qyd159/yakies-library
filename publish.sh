#!/bin/bash

if [[ $(git status --porcelain) && $2 != 'direct' ]]; then
  pnpm changeset version
  echo "请输入提交信息: "
  read commitMessage
  git add .
  git commit -m "${commitMessage}"
  git push origin main
  pnpm --dir packages/$1 run build
else
  echo "跳过预处理"
fi
if [ $1 = "all" ]; then
  pnpm publish -r
else
  pnpm publish --filter $1 --registry 'https://nexus.yakies.cn/repository/hosted/' --no-git-checks
fi
