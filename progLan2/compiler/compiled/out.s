
.1byte = .byte

# crucial libs
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/out.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"

# additional libs


.data
__fpu_temp__: .4byte 0
######## user data section ########
myArr: .4byte 0
store: .4byte 0
_compLITERAL0: .asciz "nico"
name: .4byte 0
_compLITERAL1: .asciz "%i\n"
_compLITERAL2: .asciz "%s\n"
_compLITERAL3: .asciz "%i\n"
_compLITERAL4: .asciz "%i\n"
__TEMP32_0__: .4byte
__TEMP32_1__: .4byte
__TEMP32_2__: .4byte
__TEMP32_3__: .4byte
__TEMP32_4__: .4byte
__TEMP32_5__: .4byte
###################################
.text

.global main
.global user_init

user_init:
#### compiler initation section ###
mov $_compLITERAL0, %edx
mov %edx, name
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
pushl $16
swap_stack
call __allocate__
mov %eax, __TEMP32_0__
swap_stack
add $0, %eax
movl $123, (%eax)
add $4, %eax
mov name, %edx
mov %edx, (%eax)
add $8, %eax
movl $456, (%eax)
add $12, %eax
movl $7777, (%eax)
mov __TEMP32_0__, %edx
mov %edx, myArr
# -- array load begin --
mov myArr, %eax
mov $789, %ebx
mov %ebx, 8(%eax)
# --- array load end ---
# -- array read begin --
mov myArr, %eax
mov 4(%eax), %ebx
mov %ebx, __TEMP32_1__
# --- array read end ---
mov __TEMP32_1__, %edx
mov %edx, store
# -- array read begin --
mov myArr, %eax
mov 0(%eax), %ebx
mov %ebx, __TEMP32_2__
# --- array read end ---
pushl __TEMP32_2__
pushl $_compLITERAL1
swap_stack
call printf_mini
swap_stack
pushl store
pushl $_compLITERAL2
swap_stack
call printf_mini
swap_stack
# -- array read begin --
mov myArr, %eax
mov 8(%eax), %ebx
mov %ebx, __TEMP32_3__
# --- array read end ---
pushl __TEMP32_3__
pushl $_compLITERAL3
swap_stack
call printf_mini
swap_stack
pusha
xor %eax, %eax
xor %ebx, %ebx
xor %ecx, %ecx
mov $2, %eax
add $1, %eax
mov %eax, __TEMP32_4__
popa
# -- array read begin --
mov __TEMP32_4__, %eax
mov $4, %ebx
mul %ebx
mov myArr, %ebx
mov (%ebx, %eax, 1), %eax
mov %eax, __TEMP32_5__
# --- array read end ---
pushl __TEMP32_5__
pushl $_compLITERAL4
swap_stack
call printf_mini
swap_stack
swap_stack
ret
