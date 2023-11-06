
.1byte = .byte
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/out.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"

.data
######## user data section ########
_loc_Car_modelNumber: .4byte 0
_compLITERAL0: .asciz "Honda"
myCar: .4byte 0
__TEMP32_0__: .4byte
__TEMP32_1__: .4byte
###################################
.text

.global main
.global user_init

user_init:
#### compiler initation section ###

###################################
ret

main:
    call init_stacks
    //swap_stack
    call entry
    ret
Car__INITIALIZER__:
swap_stack
pop %edx
mov %edx, _loc_Car_modelNumber
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
mov $_compLITERAL0, %eax
mov %eax, (%edx)
######
mov this, %edx
mov %edx, __return_32__
entry:
swap_stack
pushl $1
swap_stack
call Car__INITIALIZER__
swap_stack
mov $__return_32__, %edx
mov %edx, myCar
swap_stack
ret
