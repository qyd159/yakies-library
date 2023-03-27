pnpm changeset version
echo "请输入提交信息: "
read commitMessage
git add .
git commit -m "${commitMessage}"
git push origin master
pnpm publish -r --registry='https://nexus.yakies.cn/repository/hosted/'
