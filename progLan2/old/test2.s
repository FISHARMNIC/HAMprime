	.section	__TEXT,__text,regular,pure_instructions
	.build_version macos, 11, 0	sdk_version 11, 3
	.globl	_myThreadFun                    ## -- Begin function myThreadFun
	.p2align	4, 0x90
_myThreadFun:                           ## @myThreadFun
Lfunc_begin0:
	.file	1 "/Users/squijano/Documents/progLan2/old" "test2.c"
	.loc	1 7 0                           ## test2.c:7:0
	.cfi_sections .debug_frame
	.cfi_startproc
## %bb.0:
	pushl	%ebp
	.cfi_def_cfa_offset 8
	.cfi_offset %ebp, -8
	movl	%esp, %ebp
	.cfi_def_cfa_register %ebp
	subl	$24, %esp
	movl	8(%ebp), %eax
Ltmp0:
	.loc	1 8 5 prologue_end              ## test2.c:8:5
	movl	$1, (%esp)
	movl	%eax, -4(%ebp)                  ## 4-byte Spill
	calll	_sleep$UNIX2003
	.loc	1 9 5                           ## test2.c:9:5
	## InlineAsm Start
	##------ in thread -----
	## InlineAsm End
	xorl	%ecx, %ecx
	movl	%eax, -8(%ebp)                  ## 4-byte Spill
	.loc	1 10 5                          ## test2.c:10:5
	movl	%ecx, %eax
	addl	$24, %esp
	popl	%ebp
	retl
Ltmp1:
Lfunc_end0:
	.cfi_endproc
                                        ## -- End function
	.globl	_main                           ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
Lfunc_begin1:
	.loc	1 14 0                          ## test2.c:14:0
	.cfi_startproc
## %bb.0:
	pushl	%ebp
	.cfi_def_cfa_offset 8
	.cfi_offset %ebp, -8
	movl	%esp, %ebp
	.cfi_def_cfa_register %ebp
	subl	$40, %esp
	calll	L1$pb
L1$pb:
	popl	%eax
	movl	$0, -4(%ebp)
Ltmp2:
	.loc	1 16 5 prologue_end             ## test2.c:16:5
	## InlineAsm Start
	##------ thread init -----
	## InlineAsm End
	.loc	1 17 5                          ## test2.c:17:5
	leal	_myThreadFun-L1$pb(%eax), %eax
	movl	%esp, %ecx
	movl	%eax, 8(%ecx)
	leal	-8(%ebp), %eax
	movl	%eax, (%ecx)
	movl	$0, 12(%ecx)
	movl	$0, 4(%ecx)
	calll	_pthread_create
	.loc	1 18 18                         ## test2.c:18:18
	movl	-8(%ebp), %ecx
	.loc	1 18 5 is_stmt 0                ## test2.c:18:5
	movl	%esp, %edx
	movl	%ecx, (%edx)
	movl	$0, 4(%edx)
	movl	%eax, -12(%ebp)                 ## 4-byte Spill
	calll	_pthread_join$UNIX2003
	.loc	1 19 5 is_stmt 1                ## test2.c:19:5
	movl	%esp, %ecx
	movl	$0, (%ecx)
	movl	%eax, -16(%ebp)                 ## 4-byte Spill
	calll	_exit
Ltmp3:
Lfunc_end1:
	.cfi_endproc
                                        ## -- End function
	.file	2 "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/usr/include/sys/_pthread" "_pthread_types.h"
	.file	3 "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/usr/include/sys/_pthread" "_pthread_t.h"
	.section	__DWARF,__debug_abbrev,regular,debug
Lsection_abbrev:
	.byte	1                               ## Abbreviation Code
	.byte	17                              ## DW_TAG_compile_unit
	.byte	1                               ## DW_CHILDREN_yes
	.byte	37                              ## DW_AT_producer
	.byte	14                              ## DW_FORM_strp
	.byte	19                              ## DW_AT_language
	.byte	5                               ## DW_FORM_data2
	.byte	3                               ## DW_AT_name
	.byte	14                              ## DW_FORM_strp
	.ascii	"\202|"                         ## DW_AT_LLVM_sysroot
	.byte	14                              ## DW_FORM_strp
	.ascii	"\357\177"                      ## DW_AT_APPLE_sdk
	.byte	14                              ## DW_FORM_strp
	.byte	16                              ## DW_AT_stmt_list
	.byte	23                              ## DW_FORM_sec_offset
	.byte	27                              ## DW_AT_comp_dir
	.byte	14                              ## DW_FORM_strp
	.byte	17                              ## DW_AT_low_pc
	.byte	1                               ## DW_FORM_addr
	.byte	18                              ## DW_AT_high_pc
	.byte	6                               ## DW_FORM_data4
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	2                               ## Abbreviation Code
	.byte	15                              ## DW_TAG_pointer_type
	.byte	0                               ## DW_CHILDREN_no
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	3                               ## Abbreviation Code
	.byte	46                              ## DW_TAG_subprogram
	.byte	1                               ## DW_CHILDREN_yes
	.byte	17                              ## DW_AT_low_pc
	.byte	1                               ## DW_FORM_addr
	.byte	18                              ## DW_AT_high_pc
	.byte	6                               ## DW_FORM_data4
	.byte	64                              ## DW_AT_frame_base
	.byte	24                              ## DW_FORM_exprloc
	.byte	3                               ## DW_AT_name
	.byte	14                              ## DW_FORM_strp
	.byte	58                              ## DW_AT_decl_file
	.byte	11                              ## DW_FORM_data1
	.byte	59                              ## DW_AT_decl_line
	.byte	11                              ## DW_FORM_data1
	.byte	39                              ## DW_AT_prototyped
	.byte	25                              ## DW_FORM_flag_present
	.byte	73                              ## DW_AT_type
	.byte	19                              ## DW_FORM_ref4
	.byte	63                              ## DW_AT_external
	.byte	25                              ## DW_FORM_flag_present
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	4                               ## Abbreviation Code
	.byte	5                               ## DW_TAG_formal_parameter
	.byte	0                               ## DW_CHILDREN_no
	.byte	2                               ## DW_AT_location
	.byte	24                              ## DW_FORM_exprloc
	.byte	3                               ## DW_AT_name
	.byte	14                              ## DW_FORM_strp
	.byte	58                              ## DW_AT_decl_file
	.byte	11                              ## DW_FORM_data1
	.byte	59                              ## DW_AT_decl_line
	.byte	11                              ## DW_FORM_data1
	.byte	73                              ## DW_AT_type
	.byte	19                              ## DW_FORM_ref4
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	5                               ## Abbreviation Code
	.byte	46                              ## DW_TAG_subprogram
	.byte	1                               ## DW_CHILDREN_yes
	.byte	17                              ## DW_AT_low_pc
	.byte	1                               ## DW_FORM_addr
	.byte	18                              ## DW_AT_high_pc
	.byte	6                               ## DW_FORM_data4
	.byte	64                              ## DW_AT_frame_base
	.byte	24                              ## DW_FORM_exprloc
	.byte	3                               ## DW_AT_name
	.byte	14                              ## DW_FORM_strp
	.byte	58                              ## DW_AT_decl_file
	.byte	11                              ## DW_FORM_data1
	.byte	59                              ## DW_AT_decl_line
	.byte	11                              ## DW_FORM_data1
	.byte	73                              ## DW_AT_type
	.byte	19                              ## DW_FORM_ref4
	.byte	63                              ## DW_AT_external
	.byte	25                              ## DW_FORM_flag_present
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	6                               ## Abbreviation Code
	.byte	52                              ## DW_TAG_variable
	.byte	0                               ## DW_CHILDREN_no
	.byte	2                               ## DW_AT_location
	.byte	24                              ## DW_FORM_exprloc
	.byte	3                               ## DW_AT_name
	.byte	14                              ## DW_FORM_strp
	.byte	58                              ## DW_AT_decl_file
	.byte	11                              ## DW_FORM_data1
	.byte	59                              ## DW_AT_decl_line
	.byte	11                              ## DW_FORM_data1
	.byte	73                              ## DW_AT_type
	.byte	19                              ## DW_FORM_ref4
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	7                               ## Abbreviation Code
	.byte	36                              ## DW_TAG_base_type
	.byte	0                               ## DW_CHILDREN_no
	.byte	3                               ## DW_AT_name
	.byte	14                              ## DW_FORM_strp
	.byte	62                              ## DW_AT_encoding
	.byte	11                              ## DW_FORM_data1
	.byte	11                              ## DW_AT_byte_size
	.byte	11                              ## DW_FORM_data1
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	8                               ## Abbreviation Code
	.byte	22                              ## DW_TAG_typedef
	.byte	0                               ## DW_CHILDREN_no
	.byte	73                              ## DW_AT_type
	.byte	19                              ## DW_FORM_ref4
	.byte	3                               ## DW_AT_name
	.byte	14                              ## DW_FORM_strp
	.byte	58                              ## DW_AT_decl_file
	.byte	11                              ## DW_FORM_data1
	.byte	59                              ## DW_AT_decl_line
	.byte	11                              ## DW_FORM_data1
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	9                               ## Abbreviation Code
	.byte	15                              ## DW_TAG_pointer_type
	.byte	0                               ## DW_CHILDREN_no
	.byte	73                              ## DW_AT_type
	.byte	19                              ## DW_FORM_ref4
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	10                              ## Abbreviation Code
	.byte	19                              ## DW_TAG_structure_type
	.byte	1                               ## DW_CHILDREN_yes
	.byte	3                               ## DW_AT_name
	.byte	14                              ## DW_FORM_strp
	.byte	11                              ## DW_AT_byte_size
	.byte	5                               ## DW_FORM_data2
	.byte	58                              ## DW_AT_decl_file
	.byte	11                              ## DW_FORM_data1
	.byte	59                              ## DW_AT_decl_line
	.byte	11                              ## DW_FORM_data1
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	11                              ## Abbreviation Code
	.byte	13                              ## DW_TAG_member
	.byte	0                               ## DW_CHILDREN_no
	.byte	3                               ## DW_AT_name
	.byte	14                              ## DW_FORM_strp
	.byte	73                              ## DW_AT_type
	.byte	19                              ## DW_FORM_ref4
	.byte	58                              ## DW_AT_decl_file
	.byte	11                              ## DW_FORM_data1
	.byte	59                              ## DW_AT_decl_line
	.byte	11                              ## DW_FORM_data1
	.byte	56                              ## DW_AT_data_member_location
	.byte	11                              ## DW_FORM_data1
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	12                              ## Abbreviation Code
	.byte	19                              ## DW_TAG_structure_type
	.byte	1                               ## DW_CHILDREN_yes
	.byte	3                               ## DW_AT_name
	.byte	14                              ## DW_FORM_strp
	.byte	11                              ## DW_AT_byte_size
	.byte	11                              ## DW_FORM_data1
	.byte	58                              ## DW_AT_decl_file
	.byte	11                              ## DW_FORM_data1
	.byte	59                              ## DW_AT_decl_line
	.byte	11                              ## DW_FORM_data1
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	13                              ## Abbreviation Code
	.byte	21                              ## DW_TAG_subroutine_type
	.byte	1                               ## DW_CHILDREN_yes
	.byte	39                              ## DW_AT_prototyped
	.byte	25                              ## DW_FORM_flag_present
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	14                              ## Abbreviation Code
	.byte	5                               ## DW_TAG_formal_parameter
	.byte	0                               ## DW_CHILDREN_no
	.byte	73                              ## DW_AT_type
	.byte	19                              ## DW_FORM_ref4
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	15                              ## Abbreviation Code
	.byte	1                               ## DW_TAG_array_type
	.byte	1                               ## DW_CHILDREN_yes
	.byte	73                              ## DW_AT_type
	.byte	19                              ## DW_FORM_ref4
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	16                              ## Abbreviation Code
	.byte	33                              ## DW_TAG_subrange_type
	.byte	0                               ## DW_CHILDREN_no
	.byte	73                              ## DW_AT_type
	.byte	19                              ## DW_FORM_ref4
	.byte	55                              ## DW_AT_count
	.byte	5                               ## DW_FORM_data2
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	17                              ## Abbreviation Code
	.byte	36                              ## DW_TAG_base_type
	.byte	0                               ## DW_CHILDREN_no
	.byte	3                               ## DW_AT_name
	.byte	14                              ## DW_FORM_strp
	.byte	11                              ## DW_AT_byte_size
	.byte	11                              ## DW_FORM_data1
	.byte	62                              ## DW_AT_encoding
	.byte	11                              ## DW_FORM_data1
	.byte	0                               ## EOM(1)
	.byte	0                               ## EOM(2)
	.byte	0                               ## EOM(3)
	.section	__DWARF,__debug_info,regular,debug
Lsection_info:
Lcu_begin0:
.set Lset0, Ldebug_info_end0-Ldebug_info_start0 ## Length of Unit
	.long	Lset0
Ldebug_info_start0:
	.short	4                               ## DWARF version number
.set Lset1, Lsection_abbrev-Lsection_abbrev ## Offset Into Abbrev. Section
	.long	Lset1
	.byte	4                               ## Address Size (in bytes)
	.byte	1                               ## Abbrev [1] 0xb:0x11d DW_TAG_compile_unit
	.long	0                               ## DW_AT_producer
	.short	12                              ## DW_AT_language
	.long	48                              ## DW_AT_name
	.long	56                              ## DW_AT_LLVM_sysroot
	.long	151                             ## DW_AT_APPLE_sdk
.set Lset2, Lline_table_start0-Lsection_line ## DW_AT_stmt_list
	.long	Lset2
	.long	162                             ## DW_AT_comp_dir
	.long	Lfunc_begin0                    ## DW_AT_low_pc
.set Lset3, Lfunc_end1-Lfunc_begin0     ## DW_AT_high_pc
	.long	Lset3
	.byte	2                               ## Abbrev [2] 0x2e:0x1 DW_TAG_pointer_type
	.byte	3                               ## Abbrev [3] 0x2f:0x24 DW_TAG_subprogram
	.long	Lfunc_begin0                    ## DW_AT_low_pc
.set Lset4, Lfunc_end0-Lfunc_begin0     ## DW_AT_high_pc
	.long	Lset4
	.byte	1                               ## DW_AT_frame_base
	.byte	85
	.long	201                             ## DW_AT_name
	.byte	1                               ## DW_AT_decl_file
	.byte	6                               ## DW_AT_decl_line
                                        ## DW_AT_prototyped
	.long	46                              ## DW_AT_type
                                        ## DW_AT_external
	.byte	4                               ## Abbrev [4] 0x44:0xe DW_TAG_formal_parameter
	.byte	2                               ## DW_AT_location
	.byte	145
	.byte	8
	.long	222                             ## DW_AT_name
	.byte	1                               ## DW_AT_decl_file
	.byte	6                               ## DW_AT_decl_line
	.long	46                              ## DW_AT_type
	.byte	0                               ## End Of Children Mark
	.byte	5                               ## Abbrev [5] 0x53:0x24 DW_TAG_subprogram
	.long	Lfunc_begin1                    ## DW_AT_low_pc
.set Lset5, Lfunc_end1-Lfunc_begin1     ## DW_AT_high_pc
	.long	Lset5
	.byte	1                               ## DW_AT_frame_base
	.byte	85
	.long	213                             ## DW_AT_name
	.byte	1                               ## DW_AT_decl_file
	.byte	13                              ## DW_AT_decl_line
	.long	119                             ## DW_AT_type
                                        ## DW_AT_external
	.byte	6                               ## Abbrev [6] 0x68:0xe DW_TAG_variable
	.byte	2                               ## DW_AT_location
	.byte	145
	.byte	120
	.long	228                             ## DW_AT_name
	.byte	1                               ## DW_AT_decl_file
	.byte	15                              ## DW_AT_decl_line
	.long	126                             ## DW_AT_type
	.byte	0                               ## End Of Children Mark
	.byte	7                               ## Abbrev [7] 0x77:0x7 DW_TAG_base_type
	.long	218                             ## DW_AT_name
	.byte	5                               ## DW_AT_encoding
	.byte	4                               ## DW_AT_byte_size
	.byte	8                               ## Abbrev [8] 0x7e:0xb DW_TAG_typedef
	.long	137                             ## DW_AT_type
	.long	238                             ## DW_AT_name
	.byte	3                               ## DW_AT_decl_file
	.byte	31                              ## DW_AT_decl_line
	.byte	8                               ## Abbrev [8] 0x89:0xb DW_TAG_typedef
	.long	148                             ## DW_AT_type
	.long	248                             ## DW_AT_name
	.byte	2                               ## DW_AT_decl_file
	.byte	118                             ## DW_AT_decl_line
	.byte	9                               ## Abbrev [9] 0x94:0x5 DW_TAG_pointer_type
	.long	153                             ## DW_AT_type
	.byte	10                              ## Abbrev [10] 0x99:0x2e DW_TAG_structure_type
	.long	267                             ## DW_AT_name
	.short	4096                            ## DW_AT_byte_size
	.byte	2                               ## DW_AT_decl_file
	.byte	103                             ## DW_AT_decl_line
	.byte	11                              ## Abbrev [11] 0xa2:0xc DW_TAG_member
	.long	285                             ## DW_AT_name
	.long	199                             ## DW_AT_type
	.byte	2                               ## DW_AT_decl_file
	.byte	104                             ## DW_AT_decl_line
	.byte	0                               ## DW_AT_data_member_location
	.byte	11                              ## Abbrev [11] 0xae:0xc DW_TAG_member
	.long	300                             ## DW_AT_name
	.long	206                             ## DW_AT_type
	.byte	2                               ## DW_AT_decl_file
	.byte	105                             ## DW_AT_decl_line
	.byte	4                               ## DW_AT_data_member_location
	.byte	11                              ## Abbrev [11] 0xba:0xc DW_TAG_member
	.long	368                             ## DW_AT_name
	.long	268                             ## DW_AT_type
	.byte	2                               ## DW_AT_decl_file
	.byte	106                             ## DW_AT_decl_line
	.byte	8                               ## DW_AT_data_member_location
	.byte	0                               ## End Of Children Mark
	.byte	7                               ## Abbrev [7] 0xc7:0x7 DW_TAG_base_type
	.long	291                             ## DW_AT_name
	.byte	5                               ## DW_AT_encoding
	.byte	4                               ## DW_AT_byte_size
	.byte	9                               ## Abbrev [9] 0xce:0x5 DW_TAG_pointer_type
	.long	211                             ## DW_AT_type
	.byte	12                              ## Abbrev [12] 0xd3:0x2d DW_TAG_structure_type
	.long	316                             ## DW_AT_name
	.byte	12                              ## DW_AT_byte_size
	.byte	2                               ## DW_AT_decl_file
	.byte	57                              ## DW_AT_decl_line
	.byte	11                              ## Abbrev [11] 0xdb:0xc DW_TAG_member
	.long	345                             ## DW_AT_name
	.long	256                             ## DW_AT_type
	.byte	2                               ## DW_AT_decl_file
	.byte	58                              ## DW_AT_decl_line
	.byte	0                               ## DW_AT_data_member_location
	.byte	11                              ## Abbrev [11] 0xe7:0xc DW_TAG_member
	.long	355                             ## DW_AT_name
	.long	46                              ## DW_AT_type
	.byte	2                               ## DW_AT_decl_file
	.byte	59                              ## DW_AT_decl_line
	.byte	4                               ## DW_AT_data_member_location
	.byte	11                              ## Abbrev [11] 0xf3:0xc DW_TAG_member
	.long	361                             ## DW_AT_name
	.long	206                             ## DW_AT_type
	.byte	2                               ## DW_AT_decl_file
	.byte	60                              ## DW_AT_decl_line
	.byte	8                               ## DW_AT_data_member_location
	.byte	0                               ## End Of Children Mark
	.byte	9                               ## Abbrev [9] 0x100:0x5 DW_TAG_pointer_type
	.long	261                             ## DW_AT_type
	.byte	13                              ## Abbrev [13] 0x105:0x7 DW_TAG_subroutine_type
                                        ## DW_AT_prototyped
	.byte	14                              ## Abbrev [14] 0x106:0x5 DW_TAG_formal_parameter
	.long	46                              ## DW_AT_type
	.byte	0                               ## End Of Children Mark
	.byte	15                              ## Abbrev [15] 0x10c:0xd DW_TAG_array_type
	.long	281                             ## DW_AT_type
	.byte	16                              ## Abbrev [16] 0x111:0x7 DW_TAG_subrange_type
	.long	288                             ## DW_AT_type
	.short	4088                            ## DW_AT_count
	.byte	0                               ## End Of Children Mark
	.byte	7                               ## Abbrev [7] 0x119:0x7 DW_TAG_base_type
	.long	377                             ## DW_AT_name
	.byte	6                               ## DW_AT_encoding
	.byte	1                               ## DW_AT_byte_size
	.byte	17                              ## Abbrev [17] 0x120:0x7 DW_TAG_base_type
	.long	382                             ## DW_AT_name
	.byte	8                               ## DW_AT_byte_size
	.byte	7                               ## DW_AT_encoding
	.byte	0                               ## End Of Children Mark
Ldebug_info_end0:
	.section	__DWARF,__debug_str,regular,debug
Linfo_string:
	.asciz	"Apple clang version 12.0.5 (clang-1205.0.22.11)" ## string offset=0
	.asciz	"test2.c"                       ## string offset=48
	.asciz	"/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk" ## string offset=56
	.asciz	"MacOSX.sdk"                    ## string offset=151
	.asciz	"/Users/squijano/Documents/progLan2/old" ## string offset=162
	.asciz	"myThreadFun"                   ## string offset=201
	.asciz	"main"                          ## string offset=213
	.asciz	"int"                           ## string offset=218
	.asciz	"vargp"                         ## string offset=222
	.asciz	"thread_id"                     ## string offset=228
	.asciz	"pthread_t"                     ## string offset=238
	.asciz	"__darwin_pthread_t"            ## string offset=248
	.asciz	"_opaque_pthread_t"             ## string offset=267
	.asciz	"__sig"                         ## string offset=285
	.asciz	"long int"                      ## string offset=291
	.asciz	"__cleanup_stack"               ## string offset=300
	.asciz	"__darwin_pthread_handler_rec"  ## string offset=316
	.asciz	"__routine"                     ## string offset=345
	.asciz	"__arg"                         ## string offset=355
	.asciz	"__next"                        ## string offset=361
	.asciz	"__opaque"                      ## string offset=368
	.asciz	"char"                          ## string offset=377
	.asciz	"__ARRAY_SIZE_TYPE__"           ## string offset=382
	.section	__DWARF,__apple_names,regular,debug
Lnames_begin:
	.long	1212240712                      ## Header Magic
	.short	1                               ## Header Version
	.short	0                               ## Header Hash Function
	.long	2                               ## Header Bucket Count
	.long	2                               ## Header Hash Count
	.long	12                              ## Header Data Length
	.long	0                               ## HeaderData Die Offset Base
	.long	1                               ## HeaderData Atom Count
	.short	1                               ## DW_ATOM_die_offset
	.short	6                               ## DW_FORM_data4
	.long	0                               ## Bucket 0
	.long	-1                              ## Bucket 1
	.long	177244780                       ## Hash in Bucket 0
	.long	2090499946                      ## Hash in Bucket 0
.set Lset6, LNames1-Lnames_begin        ## Offset in Bucket 0
	.long	Lset6
.set Lset7, LNames0-Lnames_begin        ## Offset in Bucket 0
	.long	Lset7
LNames1:
	.long	201                             ## myThreadFun
	.long	1                               ## Num DIEs
	.long	47
	.long	0
LNames0:
	.long	213                             ## main
	.long	1                               ## Num DIEs
	.long	83
	.long	0
	.section	__DWARF,__apple_objc,regular,debug
Lobjc_begin:
	.long	1212240712                      ## Header Magic
	.short	1                               ## Header Version
	.short	0                               ## Header Hash Function
	.long	1                               ## Header Bucket Count
	.long	0                               ## Header Hash Count
	.long	12                              ## Header Data Length
	.long	0                               ## HeaderData Die Offset Base
	.long	1                               ## HeaderData Atom Count
	.short	1                               ## DW_ATOM_die_offset
	.short	6                               ## DW_FORM_data4
	.long	-1                              ## Bucket 0
	.section	__DWARF,__apple_namespac,regular,debug
Lnamespac_begin:
	.long	1212240712                      ## Header Magic
	.short	1                               ## Header Version
	.short	0                               ## Header Hash Function
	.long	1                               ## Header Bucket Count
	.long	0                               ## Header Hash Count
	.long	12                              ## Header Data Length
	.long	0                               ## HeaderData Die Offset Base
	.long	1                               ## HeaderData Atom Count
	.short	1                               ## DW_ATOM_die_offset
	.short	6                               ## DW_FORM_data4
	.long	-1                              ## Bucket 0
	.section	__DWARF,__apple_types,regular,debug
Ltypes_begin:
	.long	1212240712                      ## Header Magic
	.short	1                               ## Header Version
	.short	0                               ## Header Hash Function
	.long	8                               ## Header Bucket Count
	.long	8                               ## Header Hash Count
	.long	20                              ## Header Data Length
	.long	0                               ## HeaderData Die Offset Base
	.long	3                               ## HeaderData Atom Count
	.short	1                               ## DW_ATOM_die_offset
	.short	6                               ## DW_FORM_data4
	.short	3                               ## DW_ATOM_die_tag
	.short	5                               ## DW_FORM_data2
	.short	4                               ## DW_ATOM_type_flags
	.short	11                              ## DW_FORM_data1
	.long	0                               ## Bucket 0
	.long	3                               ## Bucket 1
	.long	4                               ## Bucket 2
	.long	5                               ## Bucket 3
	.long	-1                              ## Bucket 4
	.long	7                               ## Bucket 5
	.long	-1                              ## Bucket 6
	.long	-1                              ## Bucket 7
	.long	193495088                       ## Hash in Bucket 0
	.long	1297205472                      ## Hash in Bucket 0
	.long	-1880351968                     ## Hash in Bucket 0
	.long	77135977                        ## Hash in Bucket 1
	.long	1595644866                      ## Hash in Bucket 2
	.long	2090147939                      ## Hash in Bucket 3
	.long	-594775205                      ## Hash in Bucket 3
	.long	2065860549                      ## Hash in Bucket 5
.set Lset8, Ltypes3-Ltypes_begin        ## Offset in Bucket 0
	.long	Lset8
.set Lset9, Ltypes4-Ltypes_begin        ## Offset in Bucket 0
	.long	Lset9
.set Lset10, Ltypes6-Ltypes_begin       ## Offset in Bucket 0
	.long	Lset10
.set Lset11, Ltypes1-Ltypes_begin       ## Offset in Bucket 1
	.long	Lset11
.set Lset12, Ltypes5-Ltypes_begin       ## Offset in Bucket 2
	.long	Lset12
.set Lset13, Ltypes7-Ltypes_begin       ## Offset in Bucket 3
	.long	Lset13
.set Lset14, Ltypes2-Ltypes_begin       ## Offset in Bucket 3
	.long	Lset14
.set Lset15, Ltypes0-Ltypes_begin       ## Offset in Bucket 5
	.long	Lset15
Ltypes3:
	.long	218                             ## int
	.long	1                               ## Num DIEs
	.long	119
	.short	36
	.byte	0
	.long	0
Ltypes4:
	.long	238                             ## pthread_t
	.long	1                               ## Num DIEs
	.long	126
	.short	22
	.byte	0
	.long	0
Ltypes6:
	.long	291                             ## long int
	.long	1                               ## Num DIEs
	.long	199
	.short	36
	.byte	0
	.long	0
Ltypes1:
	.long	267                             ## _opaque_pthread_t
	.long	1                               ## Num DIEs
	.long	153
	.short	19
	.byte	0
	.long	0
Ltypes5:
	.long	248                             ## __darwin_pthread_t
	.long	1                               ## Num DIEs
	.long	137
	.short	22
	.byte	0
	.long	0
Ltypes7:
	.long	377                             ## char
	.long	1                               ## Num DIEs
	.long	281
	.short	36
	.byte	0
	.long	0
Ltypes2:
	.long	382                             ## __ARRAY_SIZE_TYPE__
	.long	1                               ## Num DIEs
	.long	288
	.short	36
	.byte	0
	.long	0
Ltypes0:
	.long	316                             ## __darwin_pthread_handler_rec
	.long	1                               ## Num DIEs
	.long	211
	.short	19
	.byte	0
	.long	0
.subsections_via_symbols
	.section	__DWARF,__debug_line,regular,debug
Lsection_line:
Lline_table_start0:
