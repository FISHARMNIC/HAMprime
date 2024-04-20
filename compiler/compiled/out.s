
.1byte = .byte

# crucial libs
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/io.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"

# additional libs


.data
__fpu_temp__: .4byte 0
######## user data section ########
LABEL0:
.4byte 1
.4byte 2
.4byte 3
.4byte 4
myArr: .4byte 0
__TEMP32_0__: .4byte 0 
__TEMP32_1__: .4byte 0 
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
# --- math begin ---
pusha
xor %eax, %eax
xor %ebx, %ebx
xor %ecx, %ecx
mov myArr, %eax
add $4, %eax
mov %eax, __TEMP32_0__
popa
# --- math end ---
mov __TEMP32_0__, %edx
mov (%edx), %edx
mov %edx, __TEMP32_1__
pushl __TEMP32_1__
swap_stack
call put_int
swap_stack
swap_stack
ret
