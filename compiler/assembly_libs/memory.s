/*
|=======================|
| Library used for HAM` |
|=======================|

* Handles memory allocation and freeing

__allocate__ function<u32 length>              -> u32: address (eax)
free         function<u32 address, u32 length> -> u32:         (empty)
malloc       function<u32 length>              -> u32: address
*/

.text

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
    swap_stack
    pop %ecx # length
    pop %ebx # address
    mov $91, %eax # munmap
    int $0x80     # free
    swap_stack
    ret

# meant for freeing several blocks. Does not save/restore registers
.macro free_rapid addr, len
    mov $\()\len, %ecx
    mov \addr, %ebx
    mov $91, %eax # munmap
    int $0x80
.endm

malloc:
    call __allocate__ # already in call stack
    mov %eax, __return_32__
    ret

/*
realloc_rapid_2: # for list reallocation - copies 4 bytes one by one TODO MAKE THIS USE THE ONE IN LISTS
    swap_stack
    pop %edi # old size, newSize = old + 1
    pop %ecx # new size
    pop %esi # buffer

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

# note, upon changing a pointer, the old pointer's ownership must be removed
__allocate_new__:
    swap_stack
    pop %ecx # length
    push %ecx
    add $6, %ecx # data header
    push %ebp 
    mov $192, %eax    # mmap2
    xor %ebx, %ebx    # allocate, null means find your own spot
    mov $0x7, %edx    # protection: PROT_READ|PROT_WRITE|PROT_EXEC
    mov $0x22, %esi   # flags: MAP_PRIVATE|MAP_ANONYMOUS
    mov $-1, %edi     # fd
    xor %ebp, %ebp    # offset
    int $0x80
    pop %ebp
    pop %ecx # old size
    # result in eax
    mov %ecx, (%eax) # load size
    movb $0,  4(%eax) # load isOwned
    
    mov %eax, __MOT_currentOffset__ # move address into MOT
    addl $4, __MOT_currentOffset__  # increment offset
    movl __MOT_size__, %ebx
    cmp __MOT_currentOffset__, %ebx # check if current offset is bigger than the size
    jl .__an_skip
        push %eax # save addr
        
        # old size in ebx
        shll $1, __MOT_size__ # x2
        
        pushl __MOT__ # table
        push __MOT_size__ # new size
        push %ebx # old size
        swap_stack
        call realloc_rapid_2
        swap_stack

        # todo, call garbage collector

        pop %eax # restore old addr
    .__an_skip:
    add $5, %eax 
    #return in eax
    swap_stack
    ret

_free_new_:
    pop %ecx # address
    mov %ecx, %ebx # copy addr
    sub $6, %ecx # address of size
    mov (%ecx), %ecx # load int32 size

    push %ebp 
    mov $91, %eax # munmap
    int $0x80     # free
    pop %ebp

    ret
*/