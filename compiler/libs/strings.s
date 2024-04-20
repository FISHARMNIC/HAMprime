.data

.text

strlen:
    swap_stack
    pop %eax # string
    mov $-1, %ecx
    0:
        inc %ecx
        cmpb $0, (%eax,%ecx)
        jne 0b
    mov %ecx, __return_32__
    swap_stack
    ret 

strcmp:
        
    
