
.1byte = .byte

# crucial libs
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/io.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"

# additional libs


.data
__fpu_temp__: .4byte 0
######## user data section ########
_DriversLicense_static_minimumAge_: .4byte 16
_DriversLicense_static_id_counter_: .4byte 0
_compLITERAL0: .asciz "%i\n"
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
pushl _DriversLicense_static_minimumAge_
pushl $_compLITERAL0
swap_stack
call printf_mini
swap_stack
swap_stack
ret
