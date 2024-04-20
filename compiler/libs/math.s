.section .data



.section .text

// https://www.madwizard.org/programming/snippets?id=36
mpow: 
    swap_stack
    fldl (%esp) # exponent
    fldl 4(%esp) # base
    sub $8, %esp
    fyl2x # y * logb2(x)
    fld1  
    fld %st(1)
    fprem
    f2xm1
    faddp
    fscale
    fxch %st(1)
    fstpl __return_flt__
    swap_stack
    ret
