# This is a script to encrypt a file using gpg
gpg --gen-key
gpg --export -a "your id" > public.key
gpg --import public.key
gpg --list-keys
gpg --recipient id --encrypt myfile.txt
gpg -d myfile.txt.gpg