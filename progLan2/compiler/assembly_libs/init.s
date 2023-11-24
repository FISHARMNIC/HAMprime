.macro swap_stack
    xchg %esp, %ebp
.endm

.data
    argc: .4byte 0
    argv: .4byte 0
    FRAME_SIZE = 256
    FRAME_DBLSIZE = FRAME_SIZE * 2
    __return_8__: .byte 0
    __return_16__: .2byte 0
    __return_32__: .4byte 0
    this: .4byte 0 
.text

.global init_stacks
init_stacks:
    # todo: save command line args in "cmd_args"

    pop %eax # "init" return
    pop %ebx # "main" return

    add $FRAME_SIZE, %esp # stack goes down, so skip the first frame bytes

    mov %esp, %ebp        # load frame 1 (parameter stack)
    add $FRAME_SIZE, %esp # load frame 1     (call stack)
    
    push %ebx # "main" return
    push %eax # "init" return

    call user_init
    ret

.global PL__read_args__
PL__read_args__:    // todo
    // movl 4(%esp), %eax 
    // mov %eax, argc
    // addl $4, %esp
    // movl 8(%esp), %eax
    // mov %eax, argv
    jmp PL__read_args_fin__
