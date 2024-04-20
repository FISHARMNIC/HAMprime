#include <stdio.h>

int main()
{
    int i = 0;
    while(i <= 1000)
    {
        printf("%f\n", i * (float) 12.34);
        i = i + 1;
    }
}