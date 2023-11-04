gcc test.s -o test -fno-asynchronous-unwind-tables -no-pie -m32
chmod u+x ./test
./test