gcc out.s -o out -g -no-pie -m32 -fno-asynchronous-unwind-tables 
chmod u+x ./out
./out 1 2 3 4