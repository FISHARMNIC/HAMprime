
cmp $1, $2
jne skip1
do something...
jmp finish
skip1:
cmp $2, $3
jne skip2
do something...
jmp finish
finish:
continue code...

