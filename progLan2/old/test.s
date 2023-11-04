.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/out.s"

.data
    ### user data section ###
    genstring: .asciz "Hello world!\n" 
    hello: .8byte 0
    ### end data section ###
.text

.global main
.global user_init


user_init:
    ### compiler initation section ###
    lea genstring, %eax
    mov %eax, hello
    ### end initiation section ###
    ret

main:
    call init_stacks
    call entry
    ret

entry:
    ### user code section ###
    swap_stack
    pushl hello
    pushl $13
    swap_stack
    call put_string
    ### code section ###
ret
