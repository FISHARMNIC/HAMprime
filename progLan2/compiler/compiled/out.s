
.1byte = .byte
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/out.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"

.data
######## user data section ########
sub: .4byte 0
_loc_factorial_number: .4byte 0
_compLITERAL3: .asciz "%i\n"
__TEMP8_0__: .byte
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
    jmp PL__read_args__
    PL__read_args_fin__:
    call init_stacks
    //swap_stack
    call entry
    ret
factorial:
swap_stack
pop %edx
mov %edx, _loc_factorial_number
mov $0, %cl
xor %eax, %eax; xor %ebx, %ebx
mov _loc_factorial_number, %eax
mov $0, %ebx
cmp %ebx, %eax
sete %cl
mov %cl, __TEMP8_0__
cmpb $1, __TEMP8_0__
jne LABEL0
mov $1, %edx
mov %edx, __return_32__
swap_stack
ret
jmp LABEL1
LABEL0:
pusha
xor %eax, %eax
xor %ebx, %ebx
xor %ecx, %ecx
mov _loc_factorial_number, %eax
mov %eax, __TEMP32_0__
popa
mov __TEMP32_0__, %edx
mov %edx, sub
pushl sub
swap_stack
call factorial
swap_stack
pusha
xor %eax, %eax
xor %ebx, %ebx
xor %ecx, %ecx
mov _loc_factorial_number, %eax
mov __return_32__, %ebx
mul %ebx
mov %eax, __TEMP32_1__
popa
mov __TEMP32_1__, %edx
mov %edx, __return_32__
swap_stack
ret
jmp LABEL1
LABEL2:
LABEL1:
swap_stack
ret
entry:
swap_stack
pushl $1
swap_stack
call factorial
swap_stack
pushl __return_32__
pushl $_compLITERAL3
swap_stack
call printf_mini
swap_stack
swap_stack
ret
