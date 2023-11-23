__allocate__:
    swap_stack
    popl %ecx # length
    push %ebp 
    mov $192, %eax    # mmap2
    xor %ebx, %ebx    # allocate, null means find your own spot
    mov $0x7, %edx    # protection: PROT_READ|PROT_WRITE|PROT_EXEC
    mov $0x22, %esi   # flags: MAP_PRIVATE|MAP_ANONYMOUS
    mov $-1, %edi     # fd
    xor %ebp, %ebp    # offset
    int $0x80
    pop %ebp
    // resut in eax
    swap_stack
    ret
