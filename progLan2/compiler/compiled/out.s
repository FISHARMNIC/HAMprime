
.1byte = .byte

# crucial libs
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/out.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"

# additional libs
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/files.s"

.data
######## user data section ########
fd: .4byte 0
LABEL0:
.4byte 0
.4byte 0
.4byte 0
.4byte 0
.4byte 0
.4byte 0
.4byte 0
.4byte 0
.4byte 0
.4byte 0
.4byte 0
.4byte 0
buffer: .4byte 0
_compLITERAL1: .asciz "/Users/squijano/Documents/progLan2/examples/tests/lib_files/test_file.txt"
_compLITERAL4: .asciz "Read from file: %s\n"
_compLITERAL6: .asciz "Error in opening file\n"
__TEMP8_0__: .byte
###################################
.text

.global main
.global user_init

user_init:
#### compiler initation section ###
mov $LABEL0, %edx
mov %edx, buffer
###################################
ret

main:
    jmp PL__read_args__
    PL__read_args_fin__:
    call init_stacks
    //swap_stack
    call entry
    ret
entry:
swap_stack
pushl $_compLITERAL1
pushl $O_RDONLY
swap_stack
call fopen
swap_stack
mov __return_32__, %edx
mov %edx, fd
mov $0, %cl
xor %eax, %eax; xor %ebx, %ebx
mov fd, %eax
mov $0, %ebx
cmp %ebx, %eax
setg %cl
mov %cl, __TEMP8_0__
cmpb $1, __TEMP8_0__
jne LABEL2
pushl fd
pushl buffer
pushl $12
swap_stack
call fread
swap_stack
pushl buffer
pushl $_compLITERAL4
swap_stack
call printf_mini
swap_stack
pushl fd
swap_stack
call fclose
swap_stack
jmp LABEL3
LABEL2:
pushl $_compLITERAL6
swap_stack
call puts
swap_stack
jmp LABEL3
LABEL5:
LABEL3:
swap_stack
ret
