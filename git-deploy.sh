git status 
git add .
read -p "Enter Message for commit: " comessage
echo $comessage
git commit -m "$comessage"
git push