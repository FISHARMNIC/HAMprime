.data
PRINTF_INT32: .asciz "%i"
PRINTF_STRING: .asciz "%s"
PRINTF_NEWL: .asciz "\n"
.text
/*
push <buffer>
push <length>
swap_stack
call put_string
*/
put_string:
    swap_stack
    pop %edx # length
    pop %ecx # buffer
    mov $4, %eax # syscall
    mov $1, %ebx # file desc
    int $0x80
    swap_stack
    ret

printf_mini:
    swap_stack 
    // in stack: buffer, fmt
    call printf
    add $8, %esp
    swap_stack
    ret

puts:
    swap_stack
    popl %eax # str
    push %eax
    push $PRINTF_STRING
    call printf
    add $8, %esp
    swap_stack
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
