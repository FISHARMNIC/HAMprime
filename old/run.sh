gcc test.c test.s -S  -mfpmath=sse -march=native -fno-asynchronous-unwind-tables -no-pie -m32 