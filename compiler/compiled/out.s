
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
_loc_Square_len: .4byte 0
_loc_Square_col: .4byte 0
LABEL0: .4byte 0
_loc_Square_height: .4byte 0
_compLITERAL1: .asciz "blue"
LABEL2: .4byte 0
_loc_entry_myRoom: .4byte 0
_compLITERAL3: .asciz "red"
LABEL4: .4byte 0
_loc_entry_dadsRoom: .4byte 0
_compLITERAL5: .asciz "My room cubic feet: %i (should be 500)\n"
_compLITERAL6: .asciz "Dads room square feet: %i (should be 20)\n"
__TEMP32_0__: .4byte 0 
__TEMP32_1__: .4byte 0 
__TEMP32_2__: .4byte 0 
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
Square__INITIALIZER__:
swap_stack
pop %edx; mov %edx, _loc_Square_col
pop %edx; mov %edx, _loc_Square_len
mov _loc_Square_len, %eax
pushl %eax
mov _loc_Square_col, %eax
pushl %eax
mov $0, %eax
pushl %eax
# ------ begin malloc ------
pushl $8
swap_stack
call __allocate__
mov %eax, LABEL0
swap_stack
mov %eax, (%esp)
# ------ end malloc --------
push %eax
# -- loading "_loc_Square_len" from stack --
mov 12(%esp), %edx
mov %edx, _loc_Square_len
# -- loading "this" from stack --
mov 0(%esp), %edx
mov %edx, this
# --- beginning property address read ---
mov this, %edx
add $0, %edx
mov %edx, __TEMP32_0__
######
mov __TEMP32_0__, %edx
mov _loc_Square_len, %eax
mov %eax, (%edx)
######
# -- loading "_loc_Square_col" from stack --
mov 8(%esp), %edx
mov %edx, _loc_Square_col
# -- loading "this" from stack --
mov 0(%esp), %edx
mov %edx, this
# --- beginning property address read ---
mov this, %edx
add $4, %edx
mov %edx, __TEMP32_0__
######
mov __TEMP32_0__, %edx
mov _loc_Square_col, %eax
mov %eax, (%edx)
######
# -- loading "this" from stack --
mov 0(%esp), %edx
mov %edx, this
mov this, %eax
mov %eax, __return_32__
add $16, %esp
swap_stack
ret
Square__METHOD_area__:
swap_stack
pushl this
# -- loading "this" from stack --
mov 0(%esp), %edx
mov %edx, this
# --- beginning property value read ---
mov this, %edx
add $0, %edx
mov (%edx), %eax
mov %eax, __TEMP32_0__
# -- loading "this" from stack --
mov 0(%esp), %edx
mov %edx, this
# --- beginning property value read ---
mov this, %edx
add $0, %edx
mov (%edx), %eax
mov %eax, __TEMP32_1__
# --- math begin ---
pusha
xor %eax, %eax
xor %ebx, %ebx
xor %ecx, %ecx
mov __TEMP32_1__, %eax
mov __TEMP32_0__, %ebx
mul %ebx
mov %eax, __TEMP32_2__
popa
# --- math end ---
mov __TEMP32_2__, %edx
mov %edx, __return_32__
add $4, %esp
swap_stack
ret
add $4, %esp
swap_stack
ret
Square__METHOD_volume__:
swap_stack
pop %edx; mov %edx, _loc_Square_height
mov _loc_Square_height, %eax
pushl %eax
pushl this
mov this, %eax
mov %eax, this
swap_stack
call Square__METHOD_area__
swap_stack
# -- loading "_loc_Square_height" from stack --
mov 4(%esp), %edx
mov %edx, _loc_Square_height
# --- math begin ---
pusha
xor %eax, %eax
xor %ebx, %ebx
xor %ecx, %ecx
mov _loc_Square_height, %eax
mov __return_32__, %ebx
mul %ebx
mov %eax, __TEMP32_1__
popa
# --- math end ---
mov __TEMP32_1__, %edx
mov %edx, __return_32__
add $8, %esp
swap_stack
ret
add $8, %esp
swap_stack
ret
entry:
swap_stack
mov $0, %eax
pushl %eax
# ------ begin malloc ------
pushl $8
swap_stack
call __allocate__
mov %eax, LABEL2
swap_stack
mov %eax, (%esp)
# ------ end malloc --------
add $0, %eax
movl $10, (%eax)
add $4, %eax
mov $_compLITERAL1, %edx
mov %edx, (%eax)
# ------ end format alloc ------
mov LABEL2, %edx
mov %edx, _loc_entry_myRoom
pushl $20
pushl $_compLITERAL3
swap_stack
call Square__INITIALIZER__
swap_stack
mov $0, %eax
pushl %eax
mov __return_32__, %eax
mov %eax, 0(%esp)
mov __return_32__, %edx
mov %edx, _loc_entry_dadsRoom
mov _loc_entry_myRoom, %eax
mov %eax, this
pushl $5
swap_stack
call Square__METHOD_volume__
swap_stack
pushl __return_32__
pushl $_compLITERAL5
swap_stack
call printf_mini
swap_stack
# --- beginning property value read ---
mov _loc_entry_dadsRoom, %edx
add $0, %edx
mov (%edx), %eax
mov %eax, __TEMP32_0__
pushl __TEMP32_0__
pushl $_compLITERAL6
swap_stack
call printf_mini
swap_stack
add $8, %esp
swap_stack
ret
