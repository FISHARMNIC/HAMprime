create myBuffer 200 <- u8;

create utArr <- {123, "hi", 456};

entry function<> -> u32
{
    myBuffer[0] <- 1;
    myBuffer[1] <- 2;
    myBuffer[2] <- 3;
    myBuffer[3] <- 4;
}