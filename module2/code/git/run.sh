git diff --no-index file1.txt file2.txt > changes.patch
patch file1.txt changes.patch -o file3.txt