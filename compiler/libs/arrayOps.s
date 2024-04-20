.data

compare_32:
    swap_stack
    pop %eax # arr 1
    pop %ebx # arr 2
    mov $-4, %ecx # counter
    .loop:
        add $4, %ecx
        mov (%eax, %ecx), %edx
        cmp %edx, (%ebx, %ecx)
        