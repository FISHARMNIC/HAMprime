
.1byte = .byte

# crucial libs
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/io.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"

# additional libs
.include "/Users/squijano/Documents/progLan2/compiler/libs/lists.s"

.data
__fpu_temp__: .4byte 0
######## user data section ########
counter: .4byte 0
myArr: .4byte 0
_compLITERAL0: .asciz "\n%i\n"
__TEMP32_0__: .4byte 0 
__TEMP32_1__: .4byte 0 
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
mov $123, %eax
pushl %eax
mov $456, %edx
mov %edx, counter
mov counter, %edx
mov %edx, 0(%esp)
# ------ begin dynamic alloc ------
pushl $12
swap_stack
call __allocate__
mov %eax, __TEMP32_0__
swap_stack
movl $1, (%eax)
add $4, %eax
movl $2, (%eax)
add $4, %eax
movl $3, (%eax)
add $4, %eax
# ------- end dynamic alloc -------
mov __TEMP32_0__, %eax
pushl %eax
mov 0(%esp), %edx
mov %edx, myArr
# -- array load begin --
mov myArr, %eax
mov $4, %ebx
mov %ebx, 8(%eax)
# --- array load end ---
mov 0(%esp), %edx
mov %edx, myArr
mov 4(%esp), %edx
mov %edx, counter
pushl counter
swap_stack
call put_int
swap_stack
# -- array read begin --
mov myArr, %eax
mov 8(%eax), %ebx
mov %ebx, __TEMP32_1__
# --- array read end ---
pushl __TEMP32_1__
pushl $_compLITERAL0
swap_stack
call printf_mini
swap_stack
add $8, %esp
swap_stack
ret
