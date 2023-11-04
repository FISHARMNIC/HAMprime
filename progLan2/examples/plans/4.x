special<THREAD,INTERMITENT> fnA function<> -> u32 
{
    while(1) {
        printf_mini("hello","%s\n");
        inter;
    }
}

special<THREAD> fnB function<> -> u32
{

}

entry function<> -> u32
{
    splitThread(MAINTHREAD,fnB~fnA,fnB);
}