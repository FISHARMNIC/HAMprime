
.1byte = .byte

# crucial libs
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/io.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"

# additional libs


.data
__fpu_temp__: .4byte 0
######## user data section ########
_loc_convertToHonda_a: .4byte 0
_compLITERAL0: .asciz "honda"
_compLITERAL1: .asciz "%s\n"
_compLITERAL2: .asciz "%i\n"
_compLITERAL3: .asciz "kia"
myCar: .4byte 0
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
mov _loc_convertToHonda_a, %edx
mov %edx, _loc_convertToHonda_a
###################################
ret

main:
    jmp PL__read_args__
    PL__read_args_fin__:
    call init_stacks
    //swap_stack
    call entry
    ret
convertToHonda:
swap_stack
pop %edx; mov %edx, _loc_convertToHonda_a
mov _loc_convertToHonda_a, %eax
pushl %eax
# -- loading "_loc_convertToHonda_a" from stack --
mov 0(%esp), %edx
mov %edx, _loc_convertToHonda_a
# --- beginning property address read ---
mov _loc_convertToHonda_a, %edx
add $0, %edx
mov %edx, __TEMP32_0__
######
mov __TEMP32_0__, %edx
mov $_compLITERAL0, %eax
mov %eax, (%edx)
######
# -- loading "_loc_convertToHonda_a" from stack --
mov 0(%esp), %edx
mov %edx, _loc_convertToHonda_a
# --- beginning property value read ---
mov _loc_convertToHonda_a, %edx
add $0, %edx
mov (%edx), %eax
mov %eax, __TEMP32_1__
pushl __TEMP32_1__
pushl $_compLITERAL1
swap_stack
call printf_mini
swap_stack
# -- loading "_loc_convertToHonda_a" from stack --
mov 0(%esp), %edx
mov %edx, _loc_convertToHonda_a
# --- beginning property value read ---
mov _loc_convertToHonda_a, %edx
add $4, %edx
mov (%edx), %eax
mov %eax, __TEMP32_2__
pushl __TEMP32_2__
pushl $_compLITERAL2
swap_stack
call printf_mini
swap_stack
add $4, %esp
swap_stack
ret
entry:
swap_stack
# ------ begin format alloc ------
pushl $8
swap_stack
call __allocate__
mov %eax, __TEMP32_3__
swap_stack
add $0, %eax
mov $_compLITERAL3, %edx
mov %edx, (%eax)
add $4, %eax
movl $2000, (%eax)
# ------ end format alloc ------
mov __TEMP32_3__, %edx
mov %edx, myCar
pushl myCar
swap_stack
call convertToHonda
swap_stack
swap_stack
ret
