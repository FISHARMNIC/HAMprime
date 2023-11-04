
.1byte = .byte
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/out.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"

.data
######## user data section ########
__TEMP8_0__: .byte
__TEMP8_1__: .byte
__TEMP8_2__: .byte
__TEMP8_3__: .byte
__TEMP8_4__: .byte
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
mov $0, %cl
xor %eax, %eax; xor %ebx, %ebx
mov $111, %eax
mov $222, %ebx
cmp %ebx, %eax
setg %cl
mov %cl, __TEMP8_0__
cmpb $1, __TEMP8_0__
jne LABEL0
pushl $333
swap_stack
call put_int
swap_stack
jmp LABEL1
LABEL0:
mov $0, %cl
xor %eax, %eax; xor %ebx, %ebx
mov $444, %eax
mov $555, %ebx
cmp %ebx, %eax
setl %cl
mov %cl, __TEMP8_1__
cmpb $1, __TEMP8_1__
jne LABEL2
pushl $777
swap_stack
call put_int
swap_stack
mov $0, %cl
xor %eax, %eax; xor %ebx, %ebx
mov $222, %eax
mov $444, %ebx
cmp %ebx, %eax
setg %cl
mov %cl, __TEMP8_2__
cmpb $1, __TEMP8_2__
jne LABEL3
pushl $789
swap_stack
call put_int
swap_stack
jmp LABEL4
LABEL3:
mov $0, %cl
xor %eax, %eax; xor %ebx, %ebx
mov $123, %eax
mov $456, %ebx
cmp %ebx, %eax
setl %cl
mov %cl, __TEMP8_3__
cmpb $1, __TEMP8_3__
jne LABEL5
pushl $432
swap_stack
call put_int
swap_stack
jmp LABEL4
LABEL5:
LABEL4:
pushl $987
swap_stack
call put_int
swap_stack
jmp LABEL1
LABEL2:
mov $0, %cl
xor %eax, %eax; xor %ebx, %ebx
mov $333, %eax
mov $888, %ebx
cmp %ebx, %eax
sete %cl
mov %cl, __TEMP8_4__
cmpb $1, __TEMP8_4__
jne LABEL6
pushl $321
swap_stack
call put_int
swap_stack
jmp LABEL1
LABEL6:
LABEL1:
swap_stack
ret
