
.1byte = .byte

# crucial libs
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/init.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/io.s"
.include "/Users/squijano/Documents/progLan2/compiler/assembly_libs/memory.s"

# additional libs


.data
__fpu_temp__: .4byte 0
######## user data section ########
_loc_Price_domestic_price: .4byte 0
LABEL0: .4byte 0
_loc_Car_domestic_price: .4byte 0
_loc_Car_company: .4byte 0
LABEL1: .4byte 0
LABEL2: .4byte 0
_compLITERAL3: .asciz "kia"
LABEL4: .4byte 0
myCar: .4byte 0
_compLITERAL5: .asciz "\n%s\n"
__TEMP32_0__: .4byte 0 
__TEMP32_1__: .4byte 0 
###################################
.text

.global main
.global user_init

user_init:
#### compiler initation section ###

###################################
ret

main:
    jmp PL__read_args__
    PL__read_args_fin__:
    call init_stacks
    //swap_stack
    call entry
    ret
Price__INITIALIZER__:
swap_stack
pop %edx; mov %edx, _loc_Price_domestic_price
mov _loc_Price_domestic_price, %eax
pushl %eax
mov $0, %eax
pushl %eax
# ------ begin malloc ------
pushl $8
swap_stack
call __allocate__
mov %eax, LABEL0
swap_stack
mov %eax, (%esp)
# ------ end malloc --------
push %eax
# -- loading "_loc_Price_domestic_price" from stack --
mov 8(%esp), %edx
mov %edx, _loc_Price_domestic_price
# --- math begin ---
movss _loc_Price_domestic_price, %xmm0
movl $1157234688, __fpu_temp__
movss __fpu_temp__, %xmm1
addss %xmm1, %xmm0
movss %xmm0, __TEMP32_0__
# --- math end ---
# -- loading "this" from stack --
mov 0(%esp), %edx
mov %edx, this
# --- beginning property address read ---
mov this, %edx
add $0, %edx
mov %edx, __TEMP32_1__
######
mov __TEMP32_1__, %edx
mov __TEMP32_0__, %eax
mov %eax, (%edx)
######
# -- loading "_loc_Price_domestic_price" from stack --
mov 8(%esp), %edx
mov %edx, _loc_Price_domestic_price
# -- loading "this" from stack --
mov 0(%esp), %edx
mov %edx, this
# --- beginning property address read ---
mov this, %edx
add $4, %edx
mov %edx, __TEMP32_0__
######
mov __TEMP32_0__, %edx
mov _loc_Price_domestic_price, %eax
mov %eax, (%edx)
######
# -- loading "this" from stack --
mov 0(%esp), %edx
mov %edx, this
mov this, %eax
mov %eax, __return_32__
add $12, %esp
swap_stack
ret
Car__INITIALIZER__:
swap_stack
pop %edx; mov %edx, _loc_Car_company
pop %edx; mov %edx, _loc_Car_domestic_price
mov _loc_Car_domestic_price, %eax
pushl %eax
mov _loc_Car_company, %eax
pushl %eax
mov $0, %eax
pushl %eax
# ------ begin malloc ------
pushl $8
swap_stack
call __allocate__
mov %eax, LABEL1
swap_stack
mov %eax, (%esp)
# ------ end malloc --------
push %eax
# -- loading "_loc_Car_domestic_price" from stack --
mov 12(%esp), %edx
mov %edx, _loc_Car_domestic_price
pushl _loc_Car_domestic_price
swap_stack
call Price__INITIALIZER__
swap_stack
mov $0, %eax
pushl %eax
mov __return_32__, %eax
mov %eax, 0(%esp)
# -- loading "this" from stack --
mov 4(%esp), %edx
mov %edx, this
# --- beginning property address read ---
mov this, %edx
add $0, %edx
mov %edx, __TEMP32_0__
######
mov __TEMP32_0__, %edx
mov __return_32__, %eax
mov %eax, (%edx)
######
# -- loading "_loc_Car_company" from stack --
mov 12(%esp), %edx
mov %edx, _loc_Car_company
# -- loading "this" from stack --
mov 4(%esp), %edx
mov %edx, this
# --- beginning property address read ---
mov this, %edx
add $4, %edx
mov %edx, __TEMP32_0__
######
mov __TEMP32_0__, %edx
mov _loc_Car_company, %eax
mov %eax, (%edx)
######
# -- loading "this" from stack --
mov 4(%esp), %edx
mov %edx, this
mov this, %eax
mov %eax, __return_32__
add $20, %esp
swap_stack
ret
entry:
swap_stack
pushl $1148846080
pushl $_compLITERAL3
swap_stack
call Car__INITIALIZER__
swap_stack
mov $0, %eax
pushl %eax
mov __return_32__, %eax
mov %eax, 0(%esp)
mov __return_32__, %edx
mov %edx, myCar
# --- beginning property value read ---
mov myCar, %edx
add $0, %edx
mov (%edx), %eax
mov %eax, %edx
add $0, %edx
mov (%edx), %eax
mov %eax, __TEMP32_0__
# --- end property value read ---
pushl __TEMP32_0__
swap_stack
call put_float
swap_stack
# --- beginning property value read ---
mov myCar, %edx
add $4, %edx
mov (%edx), %eax
mov %eax, __TEMP32_0__
pushl __TEMP32_0__
pushl $_compLITERAL5
swap_stack
call printf_mini
swap_stack
add $4, %esp
swap_stack
ret
