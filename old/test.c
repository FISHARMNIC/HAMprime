#include <stdio.h>
#include <stdint.h>

void main(int argc, char **argv)
{    
    printf("%p\n", &argc);
    printf("%p : %p\n", argv, &argv);
    return; 
}