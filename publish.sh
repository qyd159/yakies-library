#!/bin/bash
if [[ $(git status --porcelain) ]]; then
  pnpm changeset version
  echo "请输入提交信息: "
  read commitMessage
  git add .
  git commit -m "${commitMessage}"
  git push origin main
else
  echo "There are no changes to commit"
fi
if [ $1 = "all" ]; then
  pnpm publish -r --registry='https://nexus.yakies.cn/repository/hosted/'
else
  echo 'pnpm --dir packages/$1 publish --registry='https://nexus.yakies.cn/repository/hosted/' --access=public'
  pnpm --dir packages/$1 publish --registry='https://nexus.yakies.cn/repository/hosted/' --access=public
fi
