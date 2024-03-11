files required;

create fd <- 0;

entry function<> -> u32
{
    fd <- fopen("/Users/squijano/Documents/progLan2/examples/tests/lib_files/test_file.txt", O_CREAT_RW);
    if(fd :> 0)
    {
            fwrite(fd, "hello world!", 12);
            puts("Successfully wrote to file\n");
            fclose(fd);
    }
    else
    {
            puts("Error in opening/creating file\n");
    }
}