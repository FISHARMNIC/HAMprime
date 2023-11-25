
.1byte = .byte
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/out.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"

.data
######## user data section ########
_loc_Square_col: .4byte 0
_loc_Square_len: .4byte 0
_loc_Square_height: .4byte 0
_compLITERAL0: .asciz "blue"
myRoom: .4byte 0
_compLITERAL1: .asciz "red"
dadsRoom: .4byte 0
_compLITERAL2: .asciz "My room cubic feet: %i\n"
_compLITERAL3: .asciz "Dads room square feet: %i\n"
__TEMP32_0__: .4byte
__TEMP32_1__: .4byte
__TEMP32_2__: .4byte
__TEMP32_3__: .4byte
__TEMP32_4__: .4byte
__TEMP32_5__: .4byte
__TEMP32_6__: .4byte
__TEMP32_7__: .4byte
__TEMP32_8__: .4byte
__TEMP32_9__: .4byte
__TEMP32_10__: .4byte
__TEMP32_11__: .4byte
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
mov %edx, _loc_Square_col
pop %edx
mov %edx, _loc_Square_len
pushl this
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
popl this
swap_stack
ret
Square__METHOD_volume__:
swap_stack
pop %edx
mov %edx, _loc_Square_height
mov this, %edx
add $0, %edx
mov (%edx), %eax
mov %eax, __TEMP32_3__
mov this, %edx
add $0, %edx
mov (%edx), %eax
mov %eax, __TEMP32_4__
pusha
xor %eax, %eax
xor %ebx, %ebx
xor %ecx, %ecx
mov __TEMP32_4__, %eax
mov __TEMP32_3__, %ebx
mul %ebx
mov _loc_Square_height, %ebx
mul %ebx
mov %eax, __TEMP32_5__
popa
mov __TEMP32_5__, %edx
mov %edx, __return_32__
swap_stack
ret
swap_stack
ret
Square__METHOD_area__:
swap_stack
mov this, %edx
add $0, %edx
mov (%edx), %eax
mov %eax, __TEMP32_6__
mov this, %edx
add $0, %edx
mov (%edx), %eax
mov %eax, __TEMP32_7__
pusha
xor %eax, %eax
xor %ebx, %ebx
xor %ecx, %ecx
mov __TEMP32_7__, %eax
mov __TEMP32_6__, %ebx
mul %ebx
mov %eax, __TEMP32_8__
popa
mov __TEMP32_8__, %edx
mov %edx, __return_32__
swap_stack
ret
swap_stack
ret
entry:
swap_stack
pushl $8
swap_stack
call __allocate__
mov %eax, __TEMP32_9__
swap_stack
add $0, %eax
movl $10, (%eax)
add $4, %eax
mov $_compLITERAL0, %edx
mov %edx, (%eax)
mov __TEMP32_9__, %edx
mov %edx, myRoom
pushl $20
pushl $_compLITERAL1
swap_stack
call Square__INITIALIZER__
swap_stack
mov __return_32__, %edx
mov %edx, dadsRoom
mov myRoom, %eax
mov %eax, this
pushl $10
swap_stack
call Square__METHOD_volume__
swap_stack
pushl __return_32__
pushl $_compLITERAL2
swap_stack
call printf_mini
swap_stack
mov dadsRoom, %edx
add $0, %edx
mov (%edx), %eax
mov %eax, __TEMP32_11__
pushl __TEMP32_11__
pushl $_compLITERAL3
swap_stack
call printf_mini
swap_stack
swap_stack
ret
