#!/bin/bash

repo_name="formatted-number";
owner_name="AlttiRi";

# Config ("true" to enable)
install="false"
build="false"
delete_folder="true"
sleep_time=1 # time before the console closing (seconds)

branch_name="gh-pages";
folder_name=".gh-pages";
commit_message="Deploy";


# It assumes that the script is located in .github/
cd ..

if [[ $install == "true" ]]; then
  npm ci
fi

if [[ $build == "true" ]]; then
  npm run build
fi

if [[ ! -d $folder_name ]]; then
  mkdir $folder_name;
fi

cd $folder_name/
pwd
git init && git remote add origin https://github.com/$owner_name/$repo_name.git

if [[ $(git ls-remote origin $branch_name | wc -w) -ne 0 ]]; then
   echo "----------------";
   echo "--- Git pull ---";
   echo "----------------";
   git pull origin $branch_name;
fi

if [[ $(ls | wc -w) -ne 0 ]]; then
   echo "-----------------------------";
   echo "--- Remove files from Git ---";
   echo "-----------------------------";
   git rm -r --cached *;
   echo "------------------------------------";
   echo "--- Remove files from the folder ---";
   echo "------------------------------------";
   rm -r $(ls);
fi


cd ..

cp -r ./dist/ $folder_name/ && 
cp index.html $folder_name/index.html && 
cd $folder_name/

ls -l

cd $folder_name/
git add .

if [[ $(git status) == *"nothing to commit, working tree clean"* ]]; then
   echo "----------------------------------------------------";
   echo "--- No changes. Skip deployment for this commit. ---";
   echo "----------------------------------------------------";
elif [[ $(cd .. && git pull) != "Already up to date." ]]; then
   echo "-----------------------------------------------------------------";
   echo "--- There is a newer commit. Skip deployment for this commit. ---";
   echo "-----------------------------------------------------------------";
else
   echo "-------------------";
   echo "--- Push commit ---";
   echo "-------------------";
   git commit -m "$commit_message" && git push https://github.com/$owner_name/$repo_name.git master:$branch_name;
   echo "--------------";
   echo "--- Pushed ---";
   echo "--------------";
fi

cd ..
if [[ $delete_folder == "true" ]]; then
  rm -rf "./$folder_name/"
fi

sleep $sleep_time
