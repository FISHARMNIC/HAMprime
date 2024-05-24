
.1byte = .byte

# crucial libs
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/io.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/cmp.s"

# additional libs


.data
__fpu_temp__: .4byte 0
######## user data section ########
LABEL0:
.4byte 1
.4byte 2
.4byte 3
aa: .4byte 0
LABEL1:
.4byte 1
.4byte 2
.4byte 3
ab: .4byte 0
_compLITERAL2: .asciz "%i\n"
__TEMP8_0__: .byte 0 
###################################
.text

.global main
.global user_init

user_init:
#### compiler initation section ###
push $16
swap_stack
call __allocate__
swap_stack
mov $LABEL0, %edx
mov %edx, aa
mov $LABEL1, %edx
mov %edx, ab
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
push aa
push ab
push $-1
push $4
swap_stack
call arrcmp
swap_stack
cmp $0, %dl
sete %cl
mov %cl, __TEMP8_0__
pushl __TEMP8_0__
pushl $_compLITERAL2
swap_stack
call printf_mini
swap_stack
swap_stack
ret
