/*
|=======================|
| Library used for HAM` |
|=======================|

* Handles file creation/read/write

fopen  function(p8 path, u32 flags)            -> u32 (file descriptor)
fwrite function(u32 fd, p8 buffer, u32, bytes) -> u32 (code)
fread  function(u32 fd, p8 buffer, u32, bytes) -> u32 (code)
fclose function(u32 fd)                        -> u32 (code)
*/

#from fcntl.h
O_ACCMODE  =   0003
O_RDONLY   =   00
O_WRONLY   =   01
O_RDWR     =   02
O_CREAT    =   0100 
O_CREAT_RW =   0102
O_EXCL     =   0200 
O_NOCTTY   =   0400 
O_TRUNC    =   01000 
O_APPEND   =   02000
O_NONBLOCK =   04000
O_NDELAY   =   $O_NONBLOCK
O_SYNC     =   04010000
O_FSYNC    =   $O_SYNC
O_ASYNC    =   020000

#for syscalls see: https://chromium.googlesource.com/chromiumos/docs/+/master/constants/syscalls.md#x86-32_bit
# or https://www.chromium.org/chromium-os/developer-library/reference/linux-constants/syscalls/

.text 
/*
function fopen(p8 path, u32 flags) -> (%eax file descriptor)
*/
fopen:
    push %eax
    push %ecx
    push %ebx

    swap_stack
    mov $0x05, %eax  # syscall "open"
    pop %ecx         # flags/perms
    pop %ebx         # pathname
    mov $00600, %edx # perms for file (if creating a new one)
    int $0x80
    mov %eax, __return_32__
    swap_stack
    
    pop %ebx
    pop %ecx
    pop %eax

    ret

/*
function fwrite(u32 fd, p8 buffer, u32, bytes)
*/
fwrite:
    push %eax
    push %ecx
    push %ebx

    swap_stack
    mov $0x04, %eax  # syscall "write"
    
    pop %edx         # bytes
    pop %ecx         # write buffer
    pop %ebx         # file descriptor

    swap_stack
    int $0x80
    mov %eax, __return_32__
    
    pop %eax
    pop %ecx
    pop %ebx

    ret

/*
function fread(u32 fd, p8 buffer, u32, bytes)
*/
fread:
    push %eax
    push %ecx
    push %ebx

    swap_stack
    mov $0x03, %eax  # syscall "read"
    
    pop %edx         # bytes
    pop %ecx         # read buffer
    pop %ebx         # file descriptor

    swap_stack
    int $0x80
    mov %eax, __return_32__
    
    pop %eax
    pop %ecx
    pop %ebx

    ret

/*
function fclose(u32 fd) -> (%eax exit code)
*/
fclose:
    push %eax
    push %ecx
    push %ebx

    swap_stack
    mov $0x06, %eax
    pop %ebx         # file descriptor
    swap_stack
    int $0x80
    mov %eax, __return_32__
    
    pop %eax
    pop %ecx
    pop %ebx
    ret
