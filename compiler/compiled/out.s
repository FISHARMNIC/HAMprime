
.1byte = .byte

# crucial libs
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/io.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/cmp.s"

# additional libs
.include "/Users/squijano/Documents/progLan2/compiler/libs/lists.s"

.data
__fpu_temp__: .4byte 0
######## user data section ########
_loc_entry_counter: .4byte 0
LABEL0: .4byte 0
_loc_entry_myArr: .4byte 0
LABEL1: .4byte 0
_loc_entry_myList_length: .4byte 0
_loc_entry_myList: .4byte 0
_compLITERAL2: .asciz "var: %i\n"
_compLITERAL3: .asciz "index: %i\n"
_compLITERAL4: .asciz "length: %i\n"
__TEMP32_0__: .4byte 0 
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
mov $0, %eax
pushl %eax
# ------ begin malloc ------
pushl $12
swap_stack
call __allocate__
mov %eax, LABEL0
swap_stack
mov %eax, (%esp)
# ------ end malloc --------
# ------- begin dynamic alloc and load -------
movl $1, (%eax)
add $4, %eax
movl $1, (%eax)
add $4, %eax
movl $3, (%eax)
add $4, %eax
# ------- end dynamic alloc and load ---------
mov LABEL0, %eax
pushl %eax
# -- loading "_loc_entry_myArr" from stack --
mov 0(%esp), %edx
mov %edx, _loc_entry_myArr
# -- array load begin --
mov _loc_entry_myArr, %eax
mov $2, %ebx
mov %ebx, 8(%eax)
# --- array load end ---
# -- loading "_loc_entry_myArr" from stack --
mov 0(%esp), %edx
mov %edx, _loc_entry_myArr
mov $0, %eax
pushl %eax
# ------ begin malloc ------
pushl $12
swap_stack
call __allocate__
mov %eax, LABEL1
swap_stack
mov %eax, (%esp)
# ------ end malloc --------
# ------- begin dynamic alloc and load -------
movl $4, (%eax)
add $4, %eax
movl $5, (%eax)
add $4, %eax
movl $6, (%eax)
add $4, %eax
# ------- end dynamic alloc and load ---------
mov $3, %edx
mov %edx, _loc_entry_myList_length
mov LABEL1, %eax
pushl %eax
mov _loc_entry_myList_length, %eax
pushl %eax
# -- loading "_loc_entry_myList" from stack --
mov 4(%esp), %edx
mov %edx, _loc_entry_myList
# -- loading "_loc_entry_myList_length" from stack --
mov 0(%esp), %edx
mov %edx, _loc_entry_myList_length
# -- array append begin --
push _loc_entry_myList
push _loc_entry_myList_length
swap_stack
call realloc_rapid
swap_stack
mov __return_32__, %eax
mov %eax, _loc_entry_myList
# --- array append end ---
# -- array load begin --
mov _loc_entry_myList, %eax
mov $7, %ebx
mov _loc_entry_myList_length, %ecx
mov %ebx, (%eax, %ecx, 4)
incl _loc_entry_myList_length
mov _loc_entry_myList_length, %edx
mov %edx, 0(%esp)
# --- array load end ---
# -- loading "_loc_entry_myList" from stack --
mov 4(%esp), %edx
mov %edx, _loc_entry_myList
# -- loading "_loc_entry_counter" from stack --
mov 20(%esp), %edx
mov %edx, _loc_entry_counter
pushl _loc_entry_counter
pushl $_compLITERAL2
swap_stack
call printf_mini
swap_stack
# -- array read begin --
mov _loc_entry_myArr, %eax
mov 8(%eax), %ebx
mov %ebx, __TEMP32_0__
# --- array read end ---
mov $777, %eax
push %eax

xor %ebx, %ebx
mov 0(%esp), %bx
pop %eax
push %ebx
pushl $_compLITERAL3
swap_stack
call printf_mini
swap_stack
# -- loading "_loc_entry_myList_length" from stack --
mov 0(%esp), %edx
mov %edx, _loc_entry_myList_length
pushl _loc_entry_myList_length
pushl $_compLITERAL4
swap_stack
call printf_mini
swap_stack
add $24, %esp
swap_stack
push 0(%esp)
ret
