	.file	"test.c"
	.text
	.section	.rodata
.LC1:
	.string	"%f"
	.text
	.globl	main
	.type	main, @function
main:
	leal	4(%esp), %ecx
	andl	$-16, %esp
	pushl	-4(%ecx)
	pushl	%ebp
	movl	%esp, %ebp
	pushl	%ebx
	pushl	%ecx
	subl	$16, %esp
	call	__x86.get_pc_thunk.ax
	addl	$_GLOBAL_OFFSET_TABLE_, %eax
	vmovss	.LC0@GOTOFF(%eax), %xmm0
	vmovss	%xmm0, -12(%ebp)
	vmovss	-12(%ebp), %xmm0
	vaddss	%xmm0, %xmm0, %xmm0
	vmovss	%xmm0, -16(%ebp)
	vcvtss2sd	-16(%ebp), %xmm0, %xmm0
	subl	$4, %esp
	leal	-8(%esp), %esp
	vmovsd	%xmm0, (%esp)
	leal	.LC1@GOTOFF(%eax), %edx
	pushl	%edx
	movl	%eax, %ebx
	call	printf@PLT
	addl	$16, %esp
	nop
	leal	-8(%ebp), %esp
	popl	%ecx
	popl	%ebx
	popl	%ebp
	leal	-4(%ecx), %esp
	ret
	.size	main, .-main
	.section	.rodata
	.align 4
.LC0:
	.long	1083179008
	.section	.text.__x86.get_pc_thunk.ax,"axG",@progbits,__x86.get_pc_thunk.ax,comdat
	.globl	__x86.get_pc_thunk.ax
	.hidden	__x86.get_pc_thunk.ax
	.type	__x86.get_pc_thunk.ax, @function
__x86.get_pc_thunk.ax:
	movl	(%esp), %eax
	ret
	.ident	"GCC: (Debian 10.2.1-6) 10.2.1 20210110"
	.section	.note.GNU-stack,"",@progbits
