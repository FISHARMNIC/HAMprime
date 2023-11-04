.data

LABEL0:
.4byte 0
.4byte 0
car: .4byte 0

.text
main:
mov $LABEL0, %eax
mov %eax, car