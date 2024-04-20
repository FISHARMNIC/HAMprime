files required;

create fd <- 0;
create buffer <- {0,0,0,0,0,0,0,0,0,0,0,0};

entry function<> -> u32
{
        fd <- fopen("/Users/squijano/Documents/progLan2/examples/tests/lib_files/test_file.txt", O_RDONLY);
        if(fd :> 0)
        {
            fread(fd, buffer, 12);
            printf_mini(buffer, "Read from file: %s\n");
            fclose(fd);
        }
        else
        {
            puts("Error in opening file\n");
        }
}