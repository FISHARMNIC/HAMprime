/*
function allocate(u32 length) -> u32(%eax)
- same idea as C malloc using mmap2
*/
__allocate__:
    swap_stack
    pop %ecx # length
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

free:
    pusha
    swap_stack
    pop %ecx # length
    pop %ebx # address
    mov $91, %eax # munmap
    int $0x80     # free
    swap_stack
    popa
    ret

malloc:
    pusha
    call __allocate__ # already in call stack
    mov %eax, __return_32__
    popa
    ret
