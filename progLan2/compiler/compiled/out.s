
.1byte = .byte
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/out.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"

.data
######## user data section ########
i: .4byte 0
b: .4byte 0
_compLITERAL4: .asciz "\n"
__TEMP8_0__: .byte
__TEMP8_1__: .byte
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
entry:
swap_stack
LABEL0:
mov $0, %cl
xor %eax, %eax; xor %ebx, %ebx
mov i, %eax
mov $100, %ebx
cmp %ebx, %eax
setl %cl
mov %cl, __TEMP8_0__
cmpb $1, __TEMP8_0__
jne LABEL1
mov $0, %edx
mov %edx, b
LABEL2:
mov $0, %cl
xor %eax, %eax; xor %ebx, %ebx
mov b, %eax
mov $20, %ebx
cmp %ebx, %eax
setl %cl
mov %cl, __TEMP8_1__
cmpb $1, __TEMP8_1__
jne LABEL3
pushl b
swap_stack
call put_int
swap_stack
pusha
xor %eax, %eax
xor %ebx, %ebx
xor %ecx, %ecx
mov b, %eax
add $1, %eax
mov %eax, __TEMP32_0__
popa
mov __TEMP32_0__, %edx
mov %edx, b
jmp LABEL2
LABEL3:
pushl $_compLITERAL4
swap_stack
call puts
swap_stack
pusha
xor %eax, %eax
xor %ebx, %ebx
xor %ecx, %ecx
mov i, %eax
add $1, %eax
mov %eax, __TEMP32_1__
popa
mov __TEMP32_1__, %edx
mov %edx, i
jmp LABEL0
LABEL1:
swap_stack
ret
