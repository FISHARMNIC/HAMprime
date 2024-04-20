#include <stdio.h> 
#include <stdlib.h> 
#include <unistd.h>  //Header file for sleep(). man 3 sleep for details. 
#include <pthread.h> 
  
void *myThreadFun(void *vargp) 
{ 
    sleep(1); 
    asm("#------ in thread -----"); 
    return NULL; 
} 
   
int main() 
{ 
    pthread_t thread_id; 
    asm("#------ thread init -----");
    pthread_create(&thread_id, NULL, myThreadFun, NULL); 
    pthread_join(thread_id, NULL); 
    exit(0); 
}