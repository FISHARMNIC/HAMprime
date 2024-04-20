/*
|=======================|
| Library used for HAM` |
|=======================|

* Handles lists

realloc  function<p32 buffer, u32 oldSize, u32 newSize> -> u32: (empty)
realloc_rapid function<p32 buffer, u32 oldSize>         -> u32: new adress
*/
.text

realloc: # for user
    swap_stack
    pop %edx # new size (bytes)
    pop %ecx # old size (bytes)
    pop %esi # buffer

    push %edx # new size
    swap_stack
    call __allocate__ # eax now holds new address
    swap_stack

    mov %eax, %edi
    cld
    rep movsb

    // todo: free old space

    swap_stack

realloc_rapid: # for list reallocation - copies 4 bytes one by one
    swap_stack
    pop %edi # old size, newSize = old + 1
    pop %esi # buffer

    mov %edi, %ecx
    inc %ecx     # new size = old + 1
    shl $2, %ecx # multiply by 4 for new size in bits WHY IN BITS THIS IS WRONG?

    push %ebp; 
    push %esi; 
    push %edi;

    mov $192, %eax    # mmap2
    xor %ebx, %ebx    # allocate, null means find your own spot
    mov $0x7, %edx    # protection: PROT_READ|PROT_WRITE|PROT_EXEC
    mov $0x22, %esi   # flags: MAP_PRIVATE|MAP_ANONYMOUS
    mov $-1, %edi     # fd
    xor %ebp, %ebp    # offset
    int $0x80
    
    pop %ecx; # counter = old size
    pop %esi; # source = old buffer
    pop %ebp; # restore ebp
    
    mov %eax, %edi # dest = new buffer
       
    push %ecx # save old size for munmap
    push %esi # save old buffer for munmap

    inc %ecx  # new size = old + 1

    cld
    rep movsl     # copy mem

    pop %ebx # old address for munmap
    pop %ecx # old length for munmap
    
    push %eax # save for return addresss
    
    mov $91, %eax # munmap
    int $0x80     # free

    popl __return_32__ # return address
    
    swap_stack
    ret
    