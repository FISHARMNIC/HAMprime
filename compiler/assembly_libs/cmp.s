/*
|=======================|
| Library used for HAM` |
|=======================|

* Handles memory allocation and freeing

arrcmp function<pX arr1, pX arr2, u32 wordSize> -> u32: same ret as strcmp 
*/

.text

arrcmp:
    swap_stack
    pop %edx # ws 
    pop %ebx # a2
    pop %eax # a1
    xor %ecx, %ecx

    # todo

    swap_stack
    ret
