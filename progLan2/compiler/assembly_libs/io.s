/*
|=======================|
| Library used for HAM` |
|=======================|

* Handles input and output via stdin/out

put_string function(u8 buffer, u32 length)   -> u32 (empty)
printf_mini function(any input, u8 format)   -> u32 (empty)
scanf_mini  function(p32 address, u8 format) -> u32 (empty)
puts function(u8 string)                     -> u32 (empty)
put_int function(u32 number)                 -> u32 (empty)
put_float function(f32 float)                -> u32 (empty)
*/

.data
PRINTF_INT32: .asciz "%i"
PRINTF_STRING: .asciz "%s"
PRINTF_NEWL: .asciz "\n"
PRINTF_FLOAT: .asciz "%f"
PRINTF_FLOAT_NL: .asciz "%f\n"
.text
/*
push <buffer>
push <length>
swap_stack
call put_string
*/
put_string:
    //pusha
    swap_stack
    pop %edx # length
    pop %ecx # buffer
    mov $4, %eax # syscall
    mov $1, %ebx # file desc
    int $0x80
    swap_stack
    //popa
    ret

printf_mini:
    //pusha
    swap_stack 
    // in stack: buffer, fmt
    call printf
    add $8, %esp
    swap_stack
    //popa
    ret

scanf_mini:
    //pusha
    swap_stack 
    // in stack: buffer, fmt
    call scanf
    add $8, %esp
    swap_stack
    //popa
    ret

puts:
    //pusha
    swap_stack
    popl %eax # str
    push %eax
    push $PRINTF_STRING
    call printf
    add $8, %esp
    swap_stack
    //popa
    ret

put_int:
    swap_stack
    popl %eax # number
    push %eax
    push $PRINTF_INT32
    call printf
    add $8, %esp
    swap_stack
    ret

put_float:
    //pusha
    swap_stack
    movss (%esp), %xmm0
    cvtss2sd %xmm0, %xmm2
    pop %eax
    sub $16, %esp
    movdqu %xmm2, (%esp)
    push $PRINTF_FLOAT
    call printf
    swap_stack
    //popa
    ret
    
put_floatln:
    //pusha
    swap_stack
    movss (%esp), %xmm0
    cvtss2sd %xmm0, %xmm2
    pop %eax
    sub $16, %esp
    movdqu %xmm2, (%esp)
    push $PRINTF_FLOAT_NL
    call printf
    swap_stack
    //popa
    ret
    