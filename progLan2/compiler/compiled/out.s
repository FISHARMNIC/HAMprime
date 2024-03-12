
.1byte = .byte

# crucial libs
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/io.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"

# additional libs


.data
__fpu_temp__: .4byte 0
######## user data section ########
_compLITERAL0: .asciz "kia"
myCar: .4byte 0
myVar: .4byte 0
__TEMP32_0__: .4byte 0 
__TEMP32_1__: .4byte 0 
__TEMP32_2__: .4byte 0 
__TEMP32_3__: .4byte 0 
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
entry:
swap_stack
# ------ begin format alloc ------
pushl $8
swap_stack
call __allocate__
mov %eax, __TEMP32_0__
swap_stack
add $0, %eax
movl $5000, (%eax)
add $4, %eax
movl $3000, (%eax)
# ------ end format alloc ------
# ------ begin format alloc ------
pushl $8
swap_stack
call __allocate__
mov %eax, __TEMP32_1__
swap_stack
add $0, %eax
mov __TEMP32_0__, %edx
mov %edx, (%eax)
add $4, %eax
mov $_compLITERAL0, %edx
mov %edx, (%eax)
# ------ end format alloc ------
mov __TEMP32_1__, %edx
mov %edx, myCar
# ------ get format property ------
mov myCar, %edx
add $0, %edx
mov (%edx), %eax
mov %eax, __TEMP32_2__
# ------ end get format prop ------
mov __TEMP32_2__, %edx
mov %edx, myVar
# ------ get format property ------
mov myVar, %edx
add $0, %edx
mov (%edx), %eax
mov %eax, __TEMP32_3__
# ------ end get format prop ------
pushl __TEMP32_3__
swap_stack
call put_int
swap_stack
swap_stack
ret
