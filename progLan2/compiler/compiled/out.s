
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
LABEL0:
.4byte 8
.4byte 9
.4byte 10
myArr: .4byte 0
myList_length: .4byte 0
myList: .4byte 0
_compLITERAL1: .asciz "%i\n"
_compLITERAL2: .asciz "%i\n"
__TEMP32_0__: .4byte
__TEMP32_1__: .4byte
__TEMP32_2__: .4byte
###################################
.text

.global main
.global user_init

user_init:
#### compiler initation section ###
mov $LABEL0, %edx
mov %edx, myArr
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
pushl $24
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
movl $4, (%eax)
add $4, %eax
movl $5, (%eax)
add $4, %eax
movl $6, (%eax)
add $4, %eax
mov __TEMP32_0__, %edx
mov %edx, myList
mov $6, %edx
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
# --- array load end ---
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
mov $8, %ebx
mov myList_length, %ecx
mov %ebx, (%eax, %ecx, 4)
incl myList_length
# --- array load end ---
# -- array read begin --
mov myList, %eax
mov 24(%eax), %ebx
mov %ebx, __TEMP32_1__
# --- array read end ---
pushl __TEMP32_1__
pushl $_compLITERAL1
swap_stack
call printf_mini
swap_stack
# -- array read begin --
mov myList, %eax
mov 28(%eax), %ebx
mov %ebx, __TEMP32_2__
# --- array read end ---
pushl __TEMP32_2__
pushl $_compLITERAL2
swap_stack
call printf_mini
swap_stack
swap_stack
ret
