
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
myList_length: .4byte 0
myList: .4byte 0
_compLITERAL0: .asciz "var: %i\n"
_compLITERAL1: .asciz "index: %i\n"
_compLITERAL2: .asciz "length: %i\n"
__TEMP32_0__: .4byte 0 
__TEMP32_1__: .4byte 0 
__TEMP32_2__: .4byte 0 
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
mov %edx, 0(%esp)
# ------ begin dynamic alloc ------
pushl $12
swap_stack
call __allocate__
mov %eax, __TEMP32_0__
swap_stack
movl $1, (%eax)
add $4, %eax
movl $1, (%eax)
add $4, %eax
movl $3, (%eax)
add $4, %eax
# ------- end dynamic alloc -------
mov __TEMP32_0__, %eax
pushl %eax
# -- loading "myArr" from stack --
mov 0(%esp), %edx
mov %edx, myArr
# -- array load begin --
mov myArr, %eax
mov $2, %ebx
mov %ebx, 8(%eax)
# --- array load end ---
# -- loading "myArr" from stack --
mov 0(%esp), %edx
mov %edx, myArr
# ------ begin dynamic alloc ------
pushl $12
swap_stack
call __allocate__
mov %eax, __TEMP32_1__
swap_stack
movl $4, (%eax)
add $4, %eax
movl $5, (%eax)
add $4, %eax
movl $6, (%eax)
add $4, %eax
# ------- end dynamic alloc -------
mov $3, %edx
mov %edx, myList_length
mov __TEMP32_1__, %eax
pushl %eax
mov myList_length, %eax
pushl %eax
# -- loading "myList" from stack --
mov 4(%esp), %edx
mov %edx, myList
# -- loading "myList_length" from stack --
mov 0(%esp), %edx
mov %edx, myList_length
# -- array append begin --
push myList
push myList_length
swap_stack
call realloc_rapid
swap_stack
mov __return_32__, %eax
mov %eax, myList
# --- array append end ---
# -- array load begin --
mov myList, %eax
mov $7, %ebx
mov myList_length, %ecx
mov %ebx, (%eax, %ecx, 4)
incl myList_length
mov myList_length, %edx
mov %edx, 0(%esp)
# --- array load end ---
# -- loading "myList" from stack --
mov 4(%esp), %edx
mov %edx, myList
# -- loading "counter" from stack --
mov 12(%esp), %edx
mov %edx, counter
pushl counter
pushl $_compLITERAL0
swap_stack
call printf_mini
swap_stack
# -- array read begin --
mov myArr, %eax
mov 8(%eax), %ebx
mov %ebx, __TEMP32_2__
# --- array read end ---
pushl __TEMP32_2__
pushl $_compLITERAL1
swap_stack
call printf_mini
swap_stack
# -- loading "myList_length" from stack --
mov 0(%esp), %edx
mov %edx, myList_length
pushl myList_length
pushl $_compLITERAL2
swap_stack
call printf_mini
swap_stack
add $16, %esp
swap_stack
ret
