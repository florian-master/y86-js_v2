import { KernelController } from '../../controllers/kernelController'
import { Memory } from '../../model/kernel-seq/memory'

let kernelController = new KernelController()
kernelController.useKernel("seq")
let yas = kernelController.getYas()

test('yas (seq, 32 bits) simple program', () => {
    const ys = `
    .pos 0
    Init:
        irmovl Stack, %ebp
        irmovl Stack, %esp
        mrmovl 0x100(%esp), %ebp
        ret
    
    .pos 0x1abc # Comment
    .align 12
    .long 0x1122
    Stack: irmovl Stack, %ebp # Comment
           irmovl Stack, %esp
        
    .long -47
    jmp Stack
    iaddl -259, %eax
    
    jmp Stack
    
    # Another comment
    .long 10000000000

    irmovl Stack, %ebp
    irmovl Stack, %esp
    rrmovl %eax, %ecx
    rmmovl %ebp, 0x1c
    mrmovl 0x1c, %ebp
    rmmovl %ebp, 4(%eax)
    mrmovl 4(%eax), %ebp
    
    # for (i=0;i<n;i--)
#    t[i] = t[i+1];

        mrmovl n,%eax      # n-i
        irmovl t,%ebx     # p

        isubl  1,%eax   # déjà fini ?
        jl     end

loop:
        rrmovl %ebx,%edx   #)
        iaddl  4,%edx      #) p+1
        mrmovl (%edx),%ecx # lire *(p+1)
        rmmovl %ecx,(%ebx) # écrire dans *p
        rrmovl %edx,%ebx   # p = p+1
        isubl  1,%eax   # décrémenter le compteur
        jge    loop
        
end:
        halt

n:
        .long 5
t:
        .long 1
        .long 4
        .long 6
        .long 4
        .long 4
        .long 3
        
`   
    let result = yas.assemble(ys)
    expect(result.errors.length).toBe(0)

    const referenceYo = 
    `

    0x0000:              |     .pos 0
    0x0000:              |     Init:
    0x0000: 30f5c81a0000 |         irmovl Stack, %ebp
    0x0006: 30f4c81a0000 |         irmovl Stack, %esp
    0x000c: 505400010000 |         mrmovl 0x100(%esp), %ebp
    0x0012: 90           |         ret
                         |     
    0x0013:              |     .pos 0x1abc # Comment
    0x1abc:              |     .align 12
    0x1ac4: 22110000     |     .long 0x1122
    0x1ac8: 30f5c81a0000 |     Stack: irmovl Stack, %ebp # Comment
    0x1ace: 30f4c81a0000 |            irmovl Stack, %esp
                         |         
    0x1ad4: d1ffffff     |     .long -47
    0x1ad8: 70c81a0000   |     jmp Stack
    0x1add: c0f0fdfeffff |     iaddl -259, %eax
                         |     
    0x1ae3: 70c81a0000   |     jmp Stack
                         |     
                         |     # Another comment
    0x1ae8: 00e40b54     |     .long 10000000000
                         | 
    0x1aec: 30f5c81a0000 |     irmovl Stack, %ebp
    0x1af2: 30f4c81a0000 |     irmovl Stack, %esp
    0x1af8: 2001         |     rrmovl %eax, %ecx
    0x1afa: 405f1c000000 |     rmmovl %ebp, 0x1c
    0x1b00: 505f1c000000 |     mrmovl 0x1c, %ebp
    0x1b06: 405004000000 |     rmmovl %ebp, 4(%eax)
    0x1b0c: 505004000000 |     mrmovl 4(%eax), %ebp
                         |     
                         |     # for (i=0;i<n;i--)
                         | #    t[i] = t[i+1];
                         | 
    0x1b12: 500f4b1b0000 |         mrmovl n,%eax      # n-i
    0x1b18: 30f34f1b0000 |         irmovl t,%ebx     # p
                         | 
    0x1b1e: c1f001000000 |         isubl  1,%eax   # déjà fini ?
    0x1b24: 724a1b0000   |         jl     end
                         | 
    0x1b29:              | loop:
    0x1b29: 2032         |         rrmovl %ebx,%edx   #)
    0x1b2b: c0f204000000 |         iaddl  4,%edx      #) p+1
    0x1b31: 501200000000 |         mrmovl (%edx),%ecx # lire *(p+1)
    0x1b37: 401300000000 |         rmmovl %ecx,(%ebx) # écrire dans *p
    0x1b3d: 2023         |         rrmovl %edx,%ebx   # p = p+1
    0x1b3f: c1f001000000 |         isubl  1,%eax   # décrémenter le compteur
    0x1b45: 75291b0000   |         jge    loop
                         |         
    0x1b4a:              | end:
    0x1b4a: 00           |         halt
                         | 
    0x1b4b:              | n:
    0x1b4b: 05000000     |         .long 5
    0x1b4f:              | t:
    0x1b4f: 01000000     |         .long 1
    0x1b53: 04000000     |         .long 4
    0x1b57: 06000000     |         .long 6
    0x1b5b: 04000000     |         .long 4
    0x1b5f: 04000000     |         .long 4
    0x1b63: 03000000     |         .long 3
                         |         
  
  `

    let memory = new Memory()
    memory.loadProgram(result.output)

    let referenceMemory = new Memory()
    referenceMemory.loadProgram(referenceYo)

    for(let i = 0; i < Memory.LAST_ADDRESS; i++) {
        if(memory.readByte(i) != referenceMemory.readByte(i)) {
            "Wrong byte at 0x" + console.log(i.toString(16))
        }
        expect(memory.readByte(i)).toBe(referenceMemory.readByte(i))
    }
})