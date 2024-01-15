.section .text

strlen:
    swap_stack
    pop %eax
    xor %ecx, %ecx
    0:
    inc %ecx
    cmpb [%ecx], $0
    jne 0b
    mov %ecx, __return_32__
    swap_stack
    ret

// strcmp:
//     swap_stack
//     pop %eax
//     pop %ebx
//     0:
//     mov [%eax], %cl
//     cmp %cl, [%ebx]
//     jne 1f
//     cmp %cl, $0
//     je 1f
//     cmp [%ebx], $0
//     jne
//     1:
