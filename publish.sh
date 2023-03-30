#!/bin/bash
if [[ $(git status --porcelain) ]]; then
  pnpm changeset version
  echo "请输入提交信息: "
  read commitMessage
  git add .
  git commit -m "${commitMessage}"

else
  echo "There are no changes to commit"
fi
git push origin main
if [ $1 = "all" ]; then
  pnpm publish -r --registry='https://nexus.yakies.cn/repository/hosted/'
else
  pnpm publish --dir packages/$1 -r --registry='https://nexus.yakies.cn/repository/hosted/'
fi
