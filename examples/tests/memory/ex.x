Test format
{
    valA <- u32;
    valB <- u16;
}

entry function<> -> u32
{
    puts("Allocating...\n");

    var myArr <- {1,2,3};
    var myFmt <- Test<valA:5,valB:6>;
    var myMal <- malloc(10);

    puts("Freeing...\n");

    free(myArr, # 3 * sizeof u32);
    free(myFmt, sizeof Test);
    free(myMal, 10);

    puts("Done!\n");
}