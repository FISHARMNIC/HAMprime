
.1byte = .byte
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/out.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"

.data
######## user data section ########
_loc_Square_len: .4byte 0
_loc_Square_col: .4byte 0
_compLITERAL0: .asciz "blue"
myRoom: .4byte 0
_compLITERAL1: .asciz "red"
dadsRoom: .4byte 0
_compLITERAL2: .asciz "%i\n"
__TEMP32_0__: .4byte
__TEMP32_1__: .4byte
__TEMP32_2__: .4byte
__TEMP32_3__: .4byte
__TEMP32_4__: .4byte
###################################
.text

.global main
.global user_init

user_init:
#### compiler initation section ###

###################################
ret

main:
    jmp PL__read_args__
    PL__read_args_fin__:
    call init_stacks
    //swap_stack
    call entry
    ret
Square__INITIALIZER__:
swap_stack
pop %edx
mov %edx, _loc_Square_len
pop %edx
mov %edx, _loc_Square_col
pushl $8
swap_stack
call __allocate__
swap_stack
mov %eax, this
mov this, %edx
add $0, %edx
mov %edx, __TEMP32_1__
######
mov __TEMP32_1__, %edx
mov _loc_Square_len, %eax
mov %eax, (%edx)
######
mov this, %edx
add $4, %edx
mov %edx, __TEMP32_2__
######
mov __TEMP32_2__, %edx
mov _loc_Square_col, %eax
mov %eax, (%edx)
######
mov this, %edx
mov %edx, __return_32__
swap_stack
ret
entry:
swap_stack
pushl $8
swap_stack
call __allocate__
mov %eax, __TEMP32_3__
swap_stack
add $0, %eax
movl $30, (%eax)
add $4, %eax
mov $_compLITERAL0, %edx
mov %edx, (%eax)
mov __TEMP32_3__, %edx
mov %edx, myRoom
pushl $50
pushl $_compLITERAL1
swap_stack
call Square__INITIALIZER__
swap_stack
mov __return_32__, %edx
mov %edx, dadsRoom
mov myRoom, %edx
add $4, %edx
mov (%edx), %eax
mov %eax, __TEMP32_4__
pushl __TEMP32_4__
pushl (
swap_stack
call printf_mini
swap_stack
swap_stack
ret
