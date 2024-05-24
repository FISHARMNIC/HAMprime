/*
|=======================|
| Library used for HAM` |
|=======================|

* Handles memory allocation and freeing

arrcmp function<pX arr1, pX arr2, u32 arraySize (number of items), u32 wordSize (bytes)> -> u32: same ret as strcmp 
    - arraySize can be -1. If so, it returns 0 when both items share a 0 at the same index
*/

.text

# TODO
arrcmp:
    swap_stack
    pop %edx # ws   (bytes per element)
    pop %eax # size (# of elements)
    pop %ecx # a2
    pop %ebx # a1

    mul %edx # size (eax) = bytes per element * elements
    xor %edx, %edx
    # edx is free now

    cmp $-1, %eax # if size is -1
    jne 0f

    2:
        mov (%ebx), %al
        mov %al, %dl    # al = a1[n]
        sub (%ecx), %dl # dl = a1[n] - a2[n]. Zero if equal
        jne 1f      # not equal, return
        or %al, %dl # al becomes non-zero if a1[n] = 0 AND a1[n] == a2[n]
        jz 1f      # equal and termination. return
        inc %ecx
        inc %ebx
        jmp 2b
        
    0:
        cmp $0, %eax
        je 1f
        mov (%ebx), %dl
        sub (%ecx), %dl
        jne 1f
            inc %ecx
            inc %ebx
        dec %eax
        jnz 0b
    1:
    mov %dl, __return_32__
    
    swap_stack
    ret

