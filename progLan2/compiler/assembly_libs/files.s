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

/*
function fopen(p8 path, u32 flags) -> (%eax file descriptor)
*/
fopen:
    swap_stack
    mov $0x05, %eax  # syscall "open"
    pop %ecx         # pathname
    pop %ebx         # flags/perms
    mov $00600, %edx # perms for file (if creating a new one)
    int $0x80
    mov %eax, __return_32__
    swap_stack
    ret

/*
function fwrite(u32 fd, p8 buffer, u32, bytes)
*/
fwrite:
    swap_stack
    mov $0x04, %eax  # syscall "write"
    
    pop %edx         # bytes
    pop %ecx         # write buffer
    pop %ebx         # file descriptor

    swap_stack
    int $0x80
    mov %eax, __return_32__
    ret

/*
function fread(u32 fd, p8 buffer, u32, bytes)
*/
fread:
    swap_stack
    mov $0x03, %eax  # syscall "read"
    
    pop %edx         # bytes
    pop %ecx         # read buffer
    pop %ebx         # file descriptor

    swap_stack
    int $0x80
    mov %eax, __return_32__
    ret

/*
function fclose(u32 fd) -> (%eax exit code)
*/
fclose:
    swap_stack
    mov $0x06, %eax
    pop %ebx         # file descriptor
    swap_stack
    int $0x80
    mov %eax, __return_32__
    ret
