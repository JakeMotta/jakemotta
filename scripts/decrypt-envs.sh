if ! brew ls --versions git-crypt > /dev/null; then
    echo "git-crypt not found, installing with brew..."
    brew install git-crypt
fi

GIT_CRYPT_KEY_FILE=git-crypt-xxx-web-key

if test -f $GIT_CRYPT_KEY_FILE; then
    git-crypt unlock ./$GIT_CRYPT_KEY_FILE
else
    echo "Error: Missing key file $GIT_CRYPT_KEY_FILE. Please ensure it's present in the root of this repository."
    exit 1
fi