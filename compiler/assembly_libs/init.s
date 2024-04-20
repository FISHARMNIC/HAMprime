/*
|=======================|
| Library used for HAM` |
|=======================|

* Handles setting up memory and cli args

argc           | (u32) | c argc
argv           | (u32) | c argv
__return_8__   | (u8)  | stores return value for all u8 funcs
__return_16__  | (u16) | stores return value for all u16 funcs
__return_32__  | (u32) | stores return value for all u32 funcs
__return_flt__ | (f32) | stores return value for all float funcs

initstacks      procedure
PL__read_args__ procedure
*/

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
    __return_flt__: .4byte 0
    this: .4byte 0 
.text

.global __return_8__
.global __return_16__
.global __return_32__

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
   // add $4, %esp
    movl (%esp), %eax 
    mov %eax, argc
    movl 4(%esp), %eax
   // add $4, %eax
    mov %eax, argv
    jmp PL__read_args_fin__
